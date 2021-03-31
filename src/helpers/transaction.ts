import { getAddress } from '@ethersproject/address';
import { BigNumber } from '@ethersproject/bignumber';
import { BytesLike, hexlify } from '@ethersproject/bytes';
import { TransactionReceipt, TransactionResponse } from '@ethersproject/providers';
import {
  parse as parseTransaction,
  recoverAddress,
  serialize as serializeTransaction,
  Transaction
} from '@ethersproject/transactions';
import { formatEther } from '@ethersproject/units';
import { Optional } from 'utility-types';

import { CREATION_ADDRESS } from '@config';
import { fetchGasPriceEstimates, getGasEstimate } from '@services/ApiService';
import { decodeTransfer, ERC20, getNonce, ProviderHandler } from '@services/EthService';
import { decodeApproval } from '@services/EthService/contracts/token';
import {
  getAssetByContractAndNetwork,
  getBaseAssetByNetwork,
  getNetworkByChainId,
  getStoreAccount
} from '@services/Store';
import {
  Asset,
  ExtendedAsset,
  IFailedTxReceipt,
  IPendingTxReceipt,
  ISuccessfulTxReceipt,
  ITxConfig,
  ITxData,
  ITxFromAddress,
  ITxGasLimit,
  ITxGasPrice,
  ITxHash,
  ITxHistoryStatus,
  ITxNonce,
  ITxObject,
  ITxReceipt,
  ITxStatus,
  ITxToAddress,
  ITxType,
  ITxValue,
  IUnknownTxReceipt,
  Network,
  StoreAccount,
  TAddress
} from '@types';
import {
  addHexPrefix,
  bigify,
  bigNumGasLimitToViewable,
  bigNumGasPriceToViewableGwei,
  bigNumValueToViewableEther,
  fromTokenBase,
  gasPriceToBase,
  getDecimalFromEtherUnit,
  isTransactionDataEmpty,
  toWei
} from '@utils';
import {
  hexWeiToString,
  inputGasLimitToHex,
  inputGasPriceToHex,
  inputNonceToHex
} from '@utils/makeTransaction';

const N_DIV_2 = BigNumber.from(
  '0x7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0'
);

type TxBeforeSender = Pick<ITxObject, 'to' | 'value' | 'data' | 'chainId'>;
type TxBeforeGasPrice = Optional<ITxObject, 'nonce' | 'gasLimit' | 'gasPrice'>;
type TxBeforeGasLimit = Optional<ITxObject, 'nonce' | 'gasLimit'>;
type TxBeforeNonce = Optional<ITxObject, 'nonce'>;

export const toTxReceipt = (txHash: ITxHash, status: ITxHistoryStatus) => (
  txType: ITxType,
  txConfig: ITxConfig
): IPendingTxReceipt | ISuccessfulTxReceipt | IFailedTxReceipt | IUnknownTxReceipt => {
  const { data, asset, baseAsset, amount, gasPrice, gasLimit, nonce } = txConfig;

  const txReceipt = {
    hash: txHash,
    from: getAddress(txConfig.from) as TAddress,
    receiverAddress: (txConfig.receiverAddress && getAddress(txConfig.receiverAddress)) as TAddress,
    gasLimit: BigNumber.from(gasLimit),
    gasPrice: BigNumber.from(gasPrice),
    value: BigNumber.from(txConfig.rawTransaction.value),
    to: (txConfig.rawTransaction.to && getAddress(txConfig.rawTransaction.to)) as TAddress,

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

const decodeTransaction = (signedTx: BytesLike) => {
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

const buildRawTxFromSigned = (signedTx: BytesLike): ITxObject => {
  const decodedTx = parseTransaction(signedTx);
  return ({
    ...decodedTx,
    value: decodedTx.value.toHexString() as ITxValue,
    gasLimit: decodedTx.gasLimit.toHexString() as ITxGasLimit,
    gasPrice: decodedTx.gasPrice.toHexString() as ITxGasPrice
  } as unknown) as ITxObject;
};

// needs testing
export const makeTxConfigFromSignedTx = (
  signedTx: BytesLike,
  assets: ExtendedAsset[],
  networks: Network[],
  accounts: StoreAccount[],
  oldTxConfig: ITxConfig = {} as ITxConfig
): ITxConfig => {
  const decodedTx = decodeTransaction(signedTx);
  const networkDetected = getNetworkByChainId(decodedTx.chainId, networks);
  const contractAsset = getAssetByContractAndNetwork(decodedTx.to, networkDetected)(assets);
  const baseAsset = getBaseAssetByNetwork({
    network: networkDetected || ({} as Network),
    assets
  });

  const rawTransaction = oldTxConfig.rawTransaction
    ? oldTxConfig.rawTransaction
    : buildRawTxFromSigned(signedTx);

  const txConfig = {
    rawTransaction,
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
    gasPrice: gasPriceToBase(decodedTx.gasPrice).toString(),
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
  const contractAsset = getAssetByContractAndNetwork(decodedTx.to, network)(assets);
  const baseAsset = getBaseAssetByNetwork({
    network,
    assets
  })!;
  const ercType = guessERC20Type(decodedTx.data);
  const { to, receiverAddress, amount, asset } = deriveTxFields(
    ercType,
    decodedTx.data as ITxData,
    decodedTx.to as ITxToAddress,
    decodedTx.value.toString() as ITxValue,
    baseAsset,
    contractAsset
  );

  const txConfig = {
    rawTransaction: {
      to: getAddress(to) as ITxToAddress,
      value: hexlify(decodedTx.value) as ITxValue,
      gasLimit: hexlify(decodedTx.gasLimit) as ITxGasLimit,
      data: decodedTx.data as ITxData,
      gasPrice: hexlify(decodedTx.gasPrice) as ITxGasPrice,
      nonce: hexlify(decodedTx.nonce) as ITxNonce,
      chainId: decodedTx.chainId,
      from: getAddress(decodedTx.from) as ITxFromAddress
    },
    receiverAddress: getAddress(receiverAddress) as TAddress,
    amount,
    network,
    value: BigNumber.from(decodedTx.value).toString(),
    asset,
    baseAsset,
    senderAccount: getStoreAccount(accounts)(decodedTx.from as TAddress, network.id)!,
    gasPrice: decodedTx.gasPrice.toString(),
    gasLimit: decodedTx.gasLimit.toString(),
    data: decodedTx.data,
    nonce: decodedTx.nonce.toString(),
    from: getAddress(decodedTx.from) as TAddress
  };
  return txConfig;
};

export const makeTxConfigFromTxReceipt = (
  txReceipt: ITxReceipt,
  assets: ExtendedAsset[],
  network: Network,
  accounts: StoreAccount[]
): ITxConfig => {
  const contractAsset = getAssetByContractAndNetwork(txReceipt.to, network)(assets);
  const baseAsset = getBaseAssetByNetwork({
    network,
    assets
  });

  const receiver = contractAsset ? decodeTransfer(txReceipt.data)._to : txReceipt.to;

  const txConfig = {
    rawTransaction: {
      to: txReceipt.to && getAddress(txReceipt.to),
      value: BigNumber.from(txReceipt.value).toHexString(),
      gasLimit: BigNumber.from(txReceipt.gasLimit).toHexString(),
      data: txReceipt.data,
      gasPrice: BigNumber.from(txReceipt.gasPrice).toHexString(),
      nonce: BigNumber.from(txReceipt.nonce).toHexString(),
      chainId: network.chainId,
      from: getAddress(txReceipt.from)
    },
    receiverAddress: receiver && (getAddress(receiver) as TAddress),
    amount: contractAsset
      ? fromTokenBase(toWei(decodeTransfer(txReceipt.data)._value, 0), contractAsset.decimal)
      : txReceipt.amount,
    network,
    value: BigNumber.from(txReceipt.value).toString(),
    asset: contractAsset || baseAsset,
    baseAsset,
    senderAccount: getStoreAccount(accounts)(txReceipt.from, network.id),
    gasPrice: BigNumber.from(txReceipt.gasPrice).toString(),
    gasLimit: BigNumber.from(txReceipt.gasLimit).toString(),
    data: txReceipt.data,
    nonce: txReceipt.nonce,
    from: getAddress(txReceipt.from)
  };
  // @ts-expect-error Ignore possible missing senderAccount for now
  return txConfig;
};

// needs testing
export const makeTxItem = (
  txType: ITxType,
  txConfig: ITxConfig,
  txHash: ITxHash,
  txReceipt?: TransactionReceipt
) => {
  if (!txReceipt) {
    return {
      txReceipt: makePendingTxReceipt(txHash)(txType, txConfig),
      txConfig
    };
  } else {
    const status = txReceipt.status === 1 ? ITxStatus.SUCCESS : ITxStatus.FAILED;
    return {
      txReceipt: toTxReceipt(txHash, status)(txType, txConfig),
      txConfig
    };
  }
};

// Derives TX Fields to be used in other functions in this file.
// Uses below functions and standarizes output for usage in constructed objects
export const deriveTxFields = (
  ercType: ERCType,
  data: ITxData,
  toAddress: ITxToAddress,
  value: ITxValue,
  baseAsset: Asset,
  contractAsset?: Asset
) => {
  const isERC20 = ercType !== ERCType.NONE;
  const { to, amount: rawAmount, receiverAddress } = deriveTxRecipientsAndAmount(
    ercType,
    data,
    toAddress,
    value
  );

  const amount =
    isERC20 && contractAsset
      ? fromTokenBase(toWei(rawAmount, 0), contractAsset.decimal)
      : formatEther(value);

  const asset = isERC20 && contractAsset ? contractAsset : baseAsset;
  return { to, amount, receiverAddress, asset };
};

export enum ERCType {
  TRANSFER = 'transfer',
  APPROVAL = 'approval',
  NONE = 'none'
}

// We can't interpret every transaction's data field so this interprets only if a data field is a simple erc20 transfer.
// Therefore, we're guessing if it's a simple erc20 transfer using the data field.
export const guessERC20Type = (data: string): ERCType => {
  if (isTransactionDataEmpty(data)) return ERCType.NONE;
  const { _to, _value } = decodeTransfer(data);
  // if this isn't a valid transfer, _value will return 0 and _to will return the burn address '0x0000000000000000000000000000000000000000'
  if (_to && _value && _to !== CREATION_ADDRESS) return ERCType.TRANSFER;
  const { _spender, _value: val } = decodeApproval(data);
  if (_spender && val && _spender !== CREATION_ADDRESS) return ERCType.APPROVAL;
  return ERCType.NONE;
};

export const deriveTxRecipientsAndAmount = (
  ercType: ERCType,
  data: ITxData,
  toAddress: ITxToAddress,
  value: ITxValue
) => {
  switch (ercType) {
    case ERCType.TRANSFER: {
      const { _to, _value } = decodeTransfer(data);
      return { to: toAddress, amount: _value, receiverAddress: _to };
    }

    case ERCType.APPROVAL: {
      return { to: toAddress, amount: 0, receiverAddress: toAddress };
    }
  }
  return { to: toAddress, amount: value, receiverAddress: toAddress };
};

export const appendSender = (senderAddress: ITxFromAddress) => (
  tx: TxBeforeSender
): TxBeforeGasPrice => {
  return {
    ...tx,
    from: senderAddress
  };
};

export const appendGasPrice = (network: Network) => async (
  tx: TxBeforeGasPrice
): Promise<TxBeforeGasLimit> => {
  // Respect gas price if present
  if (tx.gasPrice) {
    return tx as TxBeforeGasLimit;
  }
  const gasPrice = await fetchGasPriceEstimates(network)
    .then(({ fast }) => fast.toString())
    .then(inputGasPriceToHex)
    .then(hexWeiToString)
    .then((v) => bigify(v).toString(16))
    .then(addHexPrefix)
    .catch((err) => {
      throw new Error(`getGasPriceEstimate: ${err}`);
    });

  return {
    ...tx,
    gasPrice: gasPrice as ITxGasPrice
  };
};

export const appendGasLimit = (network: Network) => async (
  tx: TxBeforeGasLimit
): Promise<TxBeforeNonce> => {
  // Respect gas limit if present
  if (tx.gasLimit) {
    return tx as TxBeforeNonce;
  }
  try {
    const gasLimit = await getGasEstimate(network, tx)
      .then(bigify)
      .then((n) => n.multipliedBy(1.2).integerValue(7))
      .then(inputGasLimitToHex);

    return {
      ...tx,
      gasLimit
    };
  } catch (err) {
    throw new Error(`getGasEstimate: ${err.reason ? err.reason : err.message}`);
  }
};

export const appendNonce = (network: Network, senderAddress: TAddress) => async (
  tx: TxBeforeNonce
): Promise<ITxObject> => {
  const nonce = await getNonce(network, senderAddress)
    .then((n) => n.toString())
    .then(inputNonceToHex)
    .catch((err) => {
      throw new Error(`getNonce: ${err.reason ? err.reason : err.message}`);
    });

  return {
    ...tx,
    nonce
  };
};

export const verifyTransaction = (transaction: Transaction): boolean => {
  if (!transaction.r || !transaction.s || !transaction.v) {
    return false;
  }

  if (BigNumber.from(transaction.s).gt(N_DIV_2)) {
    return false;
  }

  try {
    const { r, s, v, from, hash, ...unsignedTransaction } = transaction;
    const serializedTransaction = serializeTransaction(unsignedTransaction, { r, s, v });
    return !!recoverAddress(serializedTransaction, { r, s, v });
  } catch (e) {
    return false;
  }
};

export const checkRequiresApproval = async (
  network: Network,
  token: string,
  owner: string,
  data: string
) => {
  const provider = new ProviderHandler(network);
  const { _spender, _value } = ERC20.approve.decodeInput(data);
  const allowance = await provider.getTokenAllowance(token, owner, _spender);
  // If allowance is less than the value being sent, the approval is needed
  return bigify(allowance).lt(bigify(_value));
};
