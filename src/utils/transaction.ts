import {
  Arrayish,
  parseTransaction,
  bigNumberify,
  formatEther,
  hexlify,
  BigNumber
} from 'ethers/utils';
import { TransactionResponse, TransactionReceipt } from 'ethers/providers';

import {
  getNetworkByChainId,
  getBaseAssetByNetwork,
  getAssetByContractAndNetwork,
  getStoreAccount,
  getNetworkById
} from '@services/Store';
import {
  fromTokenBase,
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
  ITxReceipt,
  IUnknownTxReceipt,
  ITxData,
  ITxToAddress,
  ITxValue,
  ITxGasLimit,
  ITxGasPrice,
  ITxNonce,
  ITxFromAddress
} from '@types';
import { CREATION_ADDRESS } from '@config';

import { isTransactionDataEmpty } from './validators';

export const toTxReceipt = (txHash: ITxHash, status: ITxHistoryStatus) => (
  txType: ITxType,
  txConfig: ITxConfig
): IPendingTxReceipt | ISuccessfulTxReceipt | IFailedTxReceipt | IUnknownTxReceipt => {
  const { data, asset, baseAsset, amount, gasPrice, gasLimit, nonce } = txConfig;

  const txReceipt = {
    hash: txHash,
    from: txConfig.from,
    receiverAddress: txConfig.receiverAddress,
    gasLimit: bigNumberify(gasLimit),
    gasPrice: bigNumberify(gasPrice),
    value: bigNumberify(txConfig.rawTransaction.value),
    to: txConfig.rawTransaction.to,

    status,
    amount,
    nonce,
    data,
    txType,
    asset,
    baseAsset,
    blockNumber: 0,
    timestamp: 0
  };
  return txReceipt;
};

export const makePendingTxReceipt = (txHash: ITxHash) => (
  txType: ITxType,
  txConfig: ITxConfig
): IPendingTxReceipt =>
  toTxReceipt(txHash, ITxStatus.PENDING)(txType, txConfig) as IPendingTxReceipt;

export const makeUnknownTxReceipt = (txHash: ITxHash) => (
  txType: ITxType,
  txConfig: ITxConfig
): IPendingTxReceipt =>
  toTxReceipt(txHash, ITxStatus.UNKNOWN)(txType, txConfig) as IPendingTxReceipt;

export const makeFinishedTxReceipt = (
  previousTxReceipt: IPendingTxReceipt,
  newStatus: ITxStatus.FAILED | ITxStatus.SUCCESS,
  timestamp?: number,
  blockNumber?: number,
  gasUsed?: BigNumber,
  confirmations?: number
): IFailedTxReceipt | ISuccessfulTxReceipt => ({
  ...previousTxReceipt,
  status: newStatus,
  timestamp: timestamp || 0,
  blockNumber: blockNumber || 0,
  gasUsed,
  confirmations
});

const decodeTransaction = (signedTx: Arrayish) => {
  const decodedTransaction = parseTransaction(signedTx);
  const gasLimit = bigNumGasLimitToViewable(decodedTransaction.gasLimit.toString());
  const gasPriceGwei = bigNumGasPriceToViewableGwei(decodedTransaction.gasPrice.toString());
  const amountToSendEther = bigNumValueToViewableEther(decodedTransaction.value.toString());

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
    receiverAddress: (contractAsset
      ? decodeTransfer(decodedTx.data)._to
      : decodedTx.to) as TAddress,
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
    from: (decodedTx.from || oldTxConfig.from) as TAddress
  };
  return txConfig;
};

// needs testing
export const makeTxConfigFromTxResponse = (
  decodedTx: TransactionResponse,
  assets: ExtendedAsset[],
  network: Network,
  accounts: StoreAccount[]
): ITxConfig => {
  const contractAsset = getAssetByContractAndNetwork(decodedTx.to || undefined, network)(assets);
  const baseAsset = getBaseAssetByNetwork({
    network,
    assets
  })!;

  const txConfig = {
    rawTransaction: {
      to: decodedTx.to as ITxToAddress,
      value: hexlify(decodedTx.value) as ITxValue,
      gasLimit: hexlify(decodedTx.gasLimit) as ITxGasLimit,
      data: decodedTx.data as ITxData,
      gasPrice: hexlify(decodedTx.gasPrice) as ITxGasPrice,
      nonce: hexlify(decodedTx.nonce) as ITxNonce,
      chainId: decodedTx.chainId,
      from: decodedTx.from as ITxFromAddress
    },
    receiverAddress: (contractAsset
      ? decodeTransfer(decodedTx.data)._to
      : decodedTx.to) as TAddress,
    amount: contractAsset
      ? fromTokenBase(toWei(decodeTransfer(decodedTx.data)._value, 0), contractAsset.decimal)
      : formatEther(decodedTx.value),
    network,
    value: toWei(decodedTx.value.toString(), getDecimalFromEtherUnit('ether')).toString(),
    asset: contractAsset || baseAsset,
    baseAsset,
    senderAccount: getStoreAccount(accounts)(decodedTx.from as TAddress, network.id)!,
    gasPrice: decodedTx.gasPrice.toString(),
    gasLimit: decodedTx.gasLimit.toString(),
    data: decodedTx.data,
    nonce: decodedTx.nonce.toString(),
    from: decodedTx.from as TAddress
  };
  return txConfig;
};

export const makeTxConfigFromTxReceipt = (
  txReceipt: ITxReceipt,
  assets: ExtendedAsset[],
  networks: Network[],
  accounts: StoreAccount[]
): ITxConfig => {
  const networkDetected = getNetworkById(txReceipt.asset.networkId, networks);
  const contractAsset = getAssetByContractAndNetwork(
    txReceipt.to || undefined,
    networkDetected
  )(assets);
  const baseAsset = getBaseAssetByNetwork({
    network: networkDetected || ({} as Network),
    assets
  });

  const txConfig = {
    rawTransaction: {
      to: txReceipt.to,
      value: bigNumberify(txReceipt.value).toHexString(),
      gasLimit: bigNumberify(txReceipt.gasLimit).toHexString(),
      data: txReceipt.data,
      gasPrice: bigNumberify(txReceipt.gasPrice).toHexString(),
      nonce: txReceipt.nonce,
      chainId: networkDetected.chainId,
      from: txReceipt.from
    },
    receiverAddress: (contractAsset
      ? decodeTransfer(txReceipt.data)._to
      : txReceipt.to) as TAddress,
    amount: contractAsset
      ? fromTokenBase(toWei(decodeTransfer(txReceipt.data)._value, 0), contractAsset.decimal)
      : txReceipt.amount,
    network: networkDetected,
    value: toWei(
      bigNumberify(txReceipt.value).toString(),
      getDecimalFromEtherUnit('ether')
    ).toString(),
    asset: contractAsset || baseAsset,
    baseAsset,
    senderAccount: getStoreAccount(accounts)(txReceipt.from, networkDetected.id),
    gasPrice: bigNumberify(txReceipt.gasPrice).toString(),
    gasLimit: bigNumberify(txReceipt.gasLimit).toString(),
    data: txReceipt.data,
    nonce: txReceipt.nonce,
    from: txReceipt.from
  };
  // @ts-ignore Ignore possible missing senderAccount for now
  return txConfig;
};

// needs testing
export const makeTxItem = (
  txType: ITxType,
  txConfig: ITxConfig,
  txResponse?: TransactionResponse,
  txReceipt?: TransactionReceipt
) => {
  if (!txReceipt) {
    return {
      txReceipt: makePendingTxReceipt(txResponse!.hash as ITxHash)(txType, txConfig),
      txConfig
    };
  } else {
    const status = txReceipt.status === 1 ? ITxStatus.SUCCESS : ITxStatus.FAILED;
    return {
      txReceipt: toTxReceipt(txResponse!.hash as ITxHash, status)(txType, txConfig),
      txConfig
    };
  }
};

// We can't interpret every transaction's data field so this interprets only if a data field is a simple erc20 transfer.
//Therefore, we're guessing if it's a simple erc20 transfer using the data field.
export const guessIfErc20Tx = (data: string): boolean => {
  if (isTransactionDataEmpty(data)) return false;
  const { _to, _value } = decodeTransfer(data);
  // if this isn't a valid transfer, _value will return 0 and _to will return the burn address '0x0000000000000000000000000000000000000000'
  if (!_to || !_value || _to === CREATION_ADDRESS) return false;
  return true;
};

export const deriveTxRecipientsAndAmount = (
  isErc20: boolean,
  data: ITxData,
  toAddress: ITxToAddress,
  value: ITxValue
) => {
  if (isErc20) {
    const { _to, _value } = decodeTransfer(data);
    return { to: toAddress, amount: _value, receiverAddress: _to };
  }
  return { to: toAddress, amount: value, receiverAddress: toAddress };
};
