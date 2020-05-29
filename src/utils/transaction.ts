import { Arrayish, parseTransaction,bigNumberify } from 'ethers/utils';
import { TransactionResponse, TransactionReceipt } from 'ethers/providers';
import isEmpty from 'ramda/src/isEmpty';

import {
  getNetworkByChainId,
  getBaseAssetByNetwork,
  getAssetByContractAndNetwork,
  getStoreAccount
} from '@services/Store';
import {
  ERC20,
  fromWei,
  fromTokenBase,
  Wei,
  hexWeiToString,
  bigNumGasLimitToViewable,
  bigNumGasPriceToViewableGwei,
  bigNumValueToViewableEther,
  decodeTransfer,
  toWei,
  getDecimalFromEtherUnit,
  gasPriceToBase
} from '@services/EthService';
import {
  ExtendedAsset,
  Network,
  ITxConfig,
  StoreAccount,
  TAddress,
  ITxType,
  ITxStatus,
  IPendingTxReceipt,
  ITxHash,
  IFailedTxReceipt,
  ISuccessfulTxReceipt,
  ITxHistoryStatus,
  StoreAsset
} from '@types';

export const toTxReceipt = (txResponse: TransactionResponse, status: ITxHistoryStatus) => (
  txType: ITxType,
  txConfig: ITxConfig,
  assets: ExtendedAsset[],
  txHash?: ITxHash
): IPendingTxReceipt | ISuccessfulTxReceipt | IFailedTxReceipt => {
  const useTxResponse = txResponse && !isEmpty(txResponse) && txResponse !== null;

  const to = useTxResponse ? txResponse.to : txConfig.rawTransaction.to;
  const data = useTxResponse ? txResponse.data : txConfig.rawTransaction.data;
  const value = useTxResponse ? txResponse.value : bigNumberify(txConfig.rawTransaction.value);

  const contractAsset = getAssetByContractAndNetwork(to, txConfig.network)(assets);
  const baseAsset = getBaseAssetByNetwork({ network: txConfig.network, assets });

  const txReceipt = {
    asset: contractAsset || txConfig.asset,
    baseAsset: baseAsset || txConfig.baseAsset,
    hash: txHash || (txResponse.hash! as ITxHash),
    from: txConfig.from as TAddress,
    receiverAddress: (contractAsset ? ERC20.transfer.decodeInput(data)._to : to) as TAddress,
    amount: contractAsset
      ? fromTokenBase(ERC20.transfer.decodeInput(data)._value, contractAsset.decimal)
      : fromWei(Wei(hexWeiToString(value.toHexString())), 'ether').toString(),
    nonce: useTxResponse ? txResponse.nonce.toString() : txConfig.rawTransaction.nonce,
    gasLimit: useTxResponse ? txResponse.gasLimit : bigNumberify(txConfig.rawTransaction.gasLimit),
    gasPrice: useTxResponse ? txResponse.gasPrice : bigNumberify(txConfig.rawTransaction.gasPrice),
    data,
    value,
    status,
    txType,
    to: to as TAddress,

    blockNumber: 0,
    timestamp: 0
  };
  return txReceipt;
};

export const makePendingTxReceipt = (txResponse: TransactionResponse) => (
  txType: ITxType,
  txConfig: ITxConfig,
  assets: ExtendedAsset[],
  txHash?: ITxHash
): IPendingTxReceipt =>
  toTxReceipt(txResponse, ITxStatus.PENDING)(txType, txConfig, assets, txHash) as IPendingTxReceipt;

export const makeFinishedTxReceipt = (
  previousTxReceipt: IPendingTxReceipt,
  newStatus: ITxStatus.FAILED | ITxStatus.SUCCESS,
  timestamp?: number,
  blockNumber?: number
): IFailedTxReceipt | ISuccessfulTxReceipt => ({
  ...previousTxReceipt,
  status: newStatus,
  timestamp: timestamp || 0,
  blockNumber: blockNumber || 0
});

const decodeTransaction = (signedTx: Arrayish) => {
  const decodedTransaction = parseTransaction(signedTx);
  const gasLimit = bigNumGasLimitToViewable(decodedTransaction.gasLimit);
  const gasPriceGwei = bigNumGasPriceToViewableGwei(decodedTransaction.gasPrice);
  const amountToSendEther = bigNumValueToViewableEther(decodedTransaction.value);

  return {
    to: decodedTransaction.to,
    from: decodedTransaction.from,
    value: amountToSendEther.toString(),
    gasLimit: gasLimit.toString(),
    gasPrice: gasPriceGwei.toString(),
    nonce: decodedTransaction.nonce,
    data: decodedTransaction.data,
    chainId: decodedTransaction.chainId
  };
};

// needs testing
export const makeTxConfigFromSignedTx = (
  signedTx: Arrayish,
  assets: ExtendedAsset[],
  networks: Network[],
  accounts: StoreAccount[],
  oldTxConfig: ITxConfig = {} as ITxConfig
): ITxConfig => {
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

  const txConfig = {
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
        ? getStoreAccount(accounts)(decodedTx.from as TAddress, networkDetected.id) ||
          oldTxConfig.senderAccount
        : oldTxConfig.senderAccount,
    gasPrice: gasPriceToBase(parseInt(decodedTx.gasPrice, 10)).toString(),
    gasLimit: decodedTx.gasLimit,
    data: decodedTx.data,
    nonce: decodedTx.nonce.toString(),
    from: decodedTx.from || oldTxConfig.from
  };
  return txConfig;
};

// needs testing
export const makeTxItem = (
  txType: ITxType,
  txConfig: ITxConfig,
  assets: StoreAsset[],
  txResponse?: TransactionResponse,
  txReceipt?: TransactionReceipt
) => {
  if (!txReceipt) {
    return {
      txReceipt: makePendingTxReceipt(txResponse!)(txType, txConfig, assets),
      txConfig
    };
  } else {
    const status = txReceipt.status === 1 ? ITxStatus.SUCCESS : ITxStatus.FAILED;
    return {
      txReceipt: toTxReceipt(txResponse!, status)(txType, txConfig, assets),
      txConfig
    };
  }
};
