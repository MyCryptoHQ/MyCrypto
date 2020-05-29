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
  ITxReceipt,
  ITxHistoryStatus,
  TxParcel
} from '@types';

export const toTxReceipt = (txResponse: TransactionResponse, status: ITxStatus.PENDING) => (
  txType: ITxType,
  txConfig: ITxConfig,
  assets: ExtendedAsset[],
  txHash?: ITxHash
): IPendingTxReceipt => {
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
    from: txConfig.from as TAddress,
    receiverAddress: txConfig.receiverAddress as TAddress,
    amount: contractAsset
      ? fromTokenBase(ERC20.transfer.decodeInput(data)._value, contractAsset.decimal)
      : fromWei(Wei(hexWeiToString(value.toHexString())), 'ether').toString(),
    to: (contractAsset ? ERC20.transfer.decodeInput(data)._to : to) as TAddress,
    nonce: useTxResponse ? txResponse.nonce.toString() : txConfig.rawTransaction.nonce,
    gasLimit: useTxResponse ? txResponse.gasLimit : bigNumberify(txConfig.rawTransaction.gasLimit),
    gasPrice: useTxResponse ? txResponse.gasPrice : bigNumberify(txConfig.rawTransaction.gasPrice),
    data,
    value,
    status,
    txType,

    blockNumber: 0,
    timestamp: 0
  };
};

export const makeTxReceiptFromTransactionReceipt = (txReceipt: TransactionReceipt) => (
  txType: ITxType,
  txConfig: ITxConfig,
  assets: ExtendedAsset[],
  status: ITxHistoryStatus
): ITxReceipt => {
  const contractAsset = getAssetByContractAndNetwork(
    txConfig.rawTransaction.to,
    txConfig.network
  )(assets);
  const baseAsset = getBaseAssetByNetwork({ network: txConfig.network, assets });
  return {
    asset: contractAsset || txConfig.asset,
    baseAsset: baseAsset || txConfig.baseAsset,
    hash: txReceipt.transactionHash! as ITxHash,
    from: txConfig.from as TAddress,
    receiverAddress: txConfig.receiverAddress as TAddress,
    value: bigNumberify(txConfig.rawTransaction.value),
    amount: contractAsset
      ? fromTokenBase(
          ERC20.transfer.decodeInput(txConfig.rawTransaction.data)._value,
          contractAsset.decimal
        )
      : fromWei(Wei(hexWeiToString(txConfig.rawTransaction.value)), 'ether').toString(),
    to: (contractAsset
      ? ERC20.transfer.decodeInput(txConfig.rawTransaction.data)._to
      : txConfig.rawTransaction.to) as TAddress,
    nonce: txConfig.rawTransaction.nonce,
    gasLimit: bigNumberify(txConfig.rawTransaction.gasLimit),
    gasPrice: bigNumberify(txConfig.rawTransaction.gasPrice),
    data: txConfig.rawTransaction.data,
    status,
    txType,

    blockNumber: 0,
    timestamp: 0
  };
};

export const makePendingTxReceipt = (txResponse: TransactionResponse) => (
  txType: ITxType,
  txConfig: ITxConfig,
  assets: ExtendedAsset[],
  txHash?: ITxHash
): IPendingTxReceipt =>
  toTxReceipt(txResponse, ITxStatus.PENDING)(txType, txConfig, assets, txHash);

export const constructFinishedTxReceipt = (txResponse: TransactionResponse) => (
  previousTxReceipt: IPendingTxReceipt,
  newStatus: ITxStatus.FAILED | ITxStatus.SUCCESS,
  timestamp?: number,
  blockNumber?: number
): IFailedTxReceipt | ISuccessfulTxReceipt => ({
  ...previousTxReceipt,
  status: newStatus,
  timestamp: timestamp || txResponse.timestamp || 0,
  blockNumber: blockNumber || txResponse.blockNumber || 0
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

export const makeTxItem = (
  txType: ITxType,
  txConfig: ITxConfig,
  tx: TxParcel,
  account: StoreAccount
) => {
  if (!tx.txReceipt) {
    return {
      txReceipt: makeTxReceiptFromTransactionReceipt(tx.txReceipt!)(
        txType,
        txConfig,
        account.assets,
        ITxStatus.PENDING
      ),
      txConfig
    };
  } else {
    const status = tx.txReceipt.status === 1 ? ITxStatus.SUCCESS : ITxStatus.FAILED;
    return {
      txReceipt: makeTxReceiptFromTransactionReceipt(tx.txReceipt)(
        txType,
        txConfig,
        account.assets,
        status
      ),
      txConfig
    };
  }
};
