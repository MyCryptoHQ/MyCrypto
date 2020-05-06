import { Arrayish, parseTransaction } from 'ethers/utils';

import {
  getAssetByContractAndNetwork,
  getAssetByUUID,
  getBaseAssetByNetwork,
  getNetworkByChainId,
  getStoreAccount
} from 'v2/services/Store';
import {
  bigNumGasLimitToViewable,
  bigNumGasPriceToViewableGwei,
  bigNumValueToViewableEther,
  decodeTransfer,
  ERC20,
  fromTokenBase,
  fromWei,
  gasPriceToBase,
  getDecimalFromEtherUnit,
  hexToString,
  hexValueToViewableEther,
  hexWeiToString,
  toWei,
  Wei
} from 'v2/services/EthService';
import {
  Asset,
  ExtendedAsset,
  ITxConfig,
  ITxHash,
  ITxObject,
  ITxReceipt,
  Network,
  StoreAccount,
  TxParcel
} from 'v2/types';
import { TAddress } from 'v2/types/address';
import { TransactionResponse } from 'ethers/providers';
import { TransactionReceipt } from 'ethers/providers/abstract-provider';
import isEmpty from 'lodash/isEmpty';

export const fromTransactionResponseToITxReceipt = (txReceipt: TransactionResponse) => (
  assets: ExtendedAsset[],
  networks: Network[]
): ITxReceipt | undefined => {
  const chainId: number = txReceipt.chainId;
  const networkDetected = getNetworkByChainId(chainId, networks);
  if (networkDetected) {
    const contractAsset = getAssetByContractAndNetwork(txReceipt.to, networkDetected)(assets);
    const baseAsset = getBaseAssetByNetwork({ network: networkDetected, assets });
    return {
      blockNumber: txReceipt.blockNumber,
      network: networkDetected,
      hash: txReceipt.hash as ITxHash,
      from: txReceipt.from as TAddress,
      asset: contractAsset ? contractAsset : baseAsset ? baseAsset : undefined, // If contractAsset, use contractAsset, else if baseAsset, use baseAsset, else 'undefined'
      value: txReceipt.value.toHexString(), // Hex - wei
      amount: contractAsset
        ? fromTokenBase(ERC20.transfer.decodeInput(txReceipt.data)._value, contractAsset.decimal)
        : fromWei(Wei(hexWeiToString(txReceipt.value.toHexString())), 'ether').toString(),
      to: contractAsset
        ? ERC20.transfer.decodeInput(txReceipt.data)._to
        : (txReceipt.to as TAddress),
      nonce: txReceipt.nonce.toString(),
      gasLimit: txReceipt.gasLimit.toString(), // Hex
      gasPrice: txReceipt.gasPrice.toString(), // Hex - wei
      data: txReceipt.data // Hex
    };
  }
  return;
};

const decodeTransaction = (signedTx: Arrayish): ITxObject => {
  const decodedTransaction = parseTransaction(signedTx);
  const gasLimit = bigNumGasLimitToViewable(decodedTransaction.gasLimit);
  const gasPriceGwei = bigNumGasPriceToViewableGwei(decodedTransaction.gasPrice);
  const amountToSendEther = bigNumValueToViewableEther(decodedTransaction.value);

  return {
    to: decodedTransaction.to as TAddress,
    from: decodedTransaction.from as TAddress,
    value: amountToSendEther.toString(),
    gasLimit: gasLimit.toString(),
    gasPrice: gasPriceGwei.toString(),
    nonce: decodedTransaction.nonce.toString(),
    data: decodedTransaction.data,
    chainId: decodedTransaction.chainId
  };
};

export const fromSignedTxToTxConfig = (
  signedTx: Arrayish,
  assets: ExtendedAsset[],
  networks: Network[],
  accounts: StoreAccount[],
  oldTxConfig: ITxConfig = {} as ITxConfig
): ITxConfig | null => {
  if (isEmpty(signedTx) || isEmpty(assets) || isEmpty(networks) || isEmpty(accounts)) {
    return null;
  }

  const decodedTx = decodeTransaction(signedTx);
  const networkDetected = getNetworkByChainId(decodedTx.chainId, networks);
  const contractAsset = getAssetByContractAndNetwork(
    decodedTx.to || undefined,
    networkDetected
  )(assets);
  const baseAsset = getBaseAssetByNetwork({
    network: networkDetected || ({} as Network),
    assets
  });

  return {
    rawTransaction: oldTxConfig.rawTransaction,
    receiverAddress: contractAsset ? decodeTransfer(decodedTx.data)._to : decodedTx.to,
    amount: contractAsset
      ? fromTokenBase(toWei(decodeTransfer(decodedTx.data)._value, 0), contractAsset.decimal)
      : decodedTx.value,
    network: networkDetected || oldTxConfig.network,
    value: toWei(decodedTx.value, getDecimalFromEtherUnit('ether')).toString(),
    asset: contractAsset || oldTxConfig.asset || baseAsset,
    baseAsset: baseAsset || oldTxConfig.baseAsset,
    senderAccount:
      decodedTx.from && networkDetected
        ? getStoreAccount(accounts)(decodedTx.from, networkDetected.id) || oldTxConfig.senderAccount
        : oldTxConfig.senderAccount,
    gasPrice: gasPriceToBase(parseInt(decodedTx.gasPrice, 10)).toString(),
    gasLimit: decodedTx.gasLimit,
    data: decodedTx.data,
    nonce: decodedTx.nonce.toString(),
    from: decodedTx.from || oldTxConfig.from
  };
};

export const fromTransactionReceiptToITxReceipt = (
  txReceipt: TransactionReceipt,
  txObject: ITxObject
) => (network: Network, assets: Asset[]): ITxReceipt => {
  const { blockNumber, transactionHash, from } = txReceipt;
  const { value, to, nonce, gasLimit, gasPrice, data } = txObject;

  return {
    blockNumber,
    network,
    hash: transactionHash as ITxHash,
    from: from as TAddress,
    asset: getBaseAssetByNetwork({ network, assets }),
    value,
    amount: value,
    to,
    nonce,
    gasLimit,
    gasPrice,
    data
  };
};
export const fromTxObjectToTxConfig = (
  rawTransaction?: ITxObject,
  account?: StoreAccount
): ITxConfig | null => {
  if (isEmpty(rawTransaction) || isEmpty(account)) {
    return null;
  }

  const { gasPrice, gasLimit, nonce, data, to, value } = rawTransaction!;
  const { address, network } = account!;
  const baseAsset = getAssetByUUID(account!.assets)(network.baseAsset)!;

  return {
    from: address,
    amount: hexValueToViewableEther(value),
    receiverAddress: to,
    senderAccount: account!,
    network,
    asset: baseAsset,
    baseAsset,
    gasPrice: hexToString(gasPrice),
    gasLimit: hexToString(gasLimit),
    value: hexWeiToString(value),
    nonce: hexToString(nonce),
    data,
    rawTransaction: rawTransaction!
  };
};

export const fromTxParcelToTxReceipt = (
  txParcel?: TxParcel,
  account?: StoreAccount
): ITxReceipt | null => {
  if (
    isEmpty(txParcel) ||
    isEmpty(txParcel!.txHash) ||
    isEmpty(txParcel!.txReceipt) ||
    isEmpty(account)
  ) {
    return null;
  }

  const {
    txRaw: { gasPrice, gasLimit, nonce, data, to, value },
    txReceipt
  } = txParcel!;
  const { transactionHash } = txReceipt!;
  const { address, network } = account!;
  const baseAsset = getAssetByUUID(account!.assets)(network.baseAsset)!;

  return {
    from: address,
    to,
    amount: hexValueToViewableEther(value),
    network,
    asset: baseAsset,
    gasPrice: hexToString(gasPrice),
    gasLimit: hexToString(gasLimit),
    value: hexWeiToString(value),
    nonce: hexToString(nonce),
    data,
    hash: transactionHash as ITxHash,
    blockNumber: 0
  };
};

export const fromSignedTxToTxObject = (signedTx: Arrayish): ITxObject => {
  return decodeTransaction(signedTx);
};
