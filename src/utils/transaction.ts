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
  ITxReceipt
} from '@types';

export const constructTxReceiptFromTransactionResponse = (txResponse: TransactionResponse) => (
  txType: ITxType,
  txConfig: ITxConfig,
  assets: ExtendedAsset[],
  txHash?: ITxHash
) => (stage: ITxStatus): ITxReceipt => {
  const useTxResponse = txResponse && !isEmpty(txResponse) && txResponse !== null;

  const to = useTxResponse ? txResponse.to : txConfig.rawTransaction.to;
  const data = useTxResponse ? txResponse.data : txConfig.rawTransaction.data;
  const value = useTxResponse ? txResponse.value : bigNumberify(txConfig.rawTransaction.value);

  const contractAsset = getAssetByContractAndNetwork(to, txConfig.network)(assets);
  const baseAsset = getBaseAssetByNetwork({ network: txConfig.network, assets });

  return {
    asset: contractAsset || txConfig.asset,
    baseAsset: baseAsset || txConfig.baseAsset,
    hash: txHash || (txResponse.hash! as ITxHash),
    from: txConfig.from,
    receiverAddress: txConfig.receiverAddress,
    amount: contractAsset
      ? fromTokenBase(ERC20.transfer.decodeInput(data)._value, contractAsset.decimal)
      : fromWei(Wei(hexWeiToString(value.toHexString())), 'ether').toString(),
    to: contractAsset ? ERC20.transfer.decodeInput(data)._to : to,
    nonce: useTxResponse ? txResponse.nonce.toString() : txConfig.rawTransaction.nonce,
    gasLimit: useTxResponse ? txResponse.gasLimit : bigNumberify(txConfig.rawTransaction.gasLimit),
    gasPrice: useTxResponse ? txResponse.gasPrice : bigNumberify(txConfig.rawTransaction.gasPrice),
    data,
    value,
    stage,
    txType,

    blockNumber: 0,
    timestamp: 0
  };
};

export const constructTxReceiptFromTransactionReceipt = (txReceipt: TransactionReceipt) => (
  txType: ITxType,
  txConfig: ITxConfig,
  assets: ExtendedAsset[],
  stage?: ITxStatus
): ITxReceipt => {
  const contractAsset = getAssetByContractAndNetwork(
    txConfig.rawTransaction.to,
    txConfig.network
  )(assets);
  const baseAsset = getBaseAssetByNetwork({ network: txConfig.network, assets });
  const transactionStatus = txReceipt.status === 1 ? ITxStatus.SUCCESS : ITxStatus.FAILED;
  return {
    asset: contractAsset || txConfig.asset,
    baseAsset: baseAsset || txConfig.baseAsset,
    hash: txReceipt.transactionHash! as ITxHash,
    from: txConfig.from,
    receiverAddress: txConfig.receiverAddress,
    value: bigNumberify(txConfig.rawTransaction.value),
    amount: contractAsset
      ? fromTokenBase(
          ERC20.transfer.decodeInput(txConfig.rawTransaction.data)._value,
          contractAsset.decimal
        )
      : fromWei(Wei(hexWeiToString(txConfig.rawTransaction.value)), 'ether').toString(),
    to: contractAsset
      ? ERC20.transfer.decodeInput(txConfig.rawTransaction.data)._to
      : txConfig.rawTransaction.to,
    nonce: txConfig.rawTransaction.nonce,
    gasLimit: bigNumberify(txConfig.rawTransaction.gasLimit),
    gasPrice: bigNumberify(txConfig.rawTransaction.gasPrice),
    data: txConfig.rawTransaction.data,
    stage: stage || transactionStatus,
    txType,

    blockNumber: 0,
    timestamp: 0
  };
};

export const constructPendingTxReceipt = (txResponse: TransactionResponse) => (
  txType: ITxType,
  txConfig: ITxConfig,
  assets: ExtendedAsset[],
  txHash?: ITxHash
): IPendingTxReceipt => {
  return constructTxReceiptFromTransactionResponse(txResponse)(txType, txConfig, assets, txHash)(
    ITxStatus.PENDING
  );
};

export const updateFinishedPendingTxReceipt = (txResponse: TransactionResponse) => (
  previousTxReceipt: IPendingTxReceipt,
  newStage: ITxStatus,
  timestamp?: number,
  blockNumber?: number
): IFailedTxReceipt | ISuccessfulTxReceipt => {
  return {
    ...previousTxReceipt,
    stage: newStage,
    timestamp: timestamp || txResponse.timestamp || 0,
    blockNumber: blockNumber || txResponse.blockNumber || 0
  };
};

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
