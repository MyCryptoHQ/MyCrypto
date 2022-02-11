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

import { CREATION_ADDRESS } from '@config';
import { fetchUniversalGasPriceEstimate, getGasEstimate } from '@services/ApiService';
import { decodeTransfer, ERC20, getNonce, ProviderHandler } from '@services/EthService';
import { decodeApproval } from '@services/EthService/contracts/token';
import {
  getAssetByContractAndNetwork,
  getAssetByUUID,
  getBaseAssetByNetwork,
  getNetworkByChainId,
  getStoreAccount
} from '@services/Store';
import {
  Asset,
  DistributiveOmit,
  ExtendedAsset,
  IFinishedTxReceipt,
  IPendingTxReceipt,
  ISimpleTxFormFull,
  ITxConfig,
  ITxData,
  ITxFromAddress,
  ITxGasLimit,
  ITxGasPrice,
  ITxHash,
  ITxHistoryStatus,
  ITxMetadata,
  ITxNonce,
  ITxObject,
  ITxReceipt,
  ITxStatus,
  ITxToAddress,
  ITxType,
  ITxValue,
  Network,
  NetworkId,
  StoreAccount,
  TAddress
} from '@types';
import {
  bigify,
  bigNumValueToViewableEther,
  fromTokenBase,
  isTransactionDataEmpty,
  isType2Tx,
  toWei
} from '@utils';
import {
  inputGasLimitToHex,
  inputGasPriceToHex,
  inputNonceToHex,
  inputValueToHex
} from '@utils/makeTransaction';
import { mapObjIndexed } from '@vendor';

import { isEIP1559Supported } from './eip1559';

const N_DIV_2 = BigNumber.from(
  '0x7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0'
);

type TxBeforeSender = Pick<ITxObject, 'to' | 'value' | 'data' | 'chainId'>;
type TxBeforeGasPrice = DistributiveOmit<
  ITxObject,
  'nonce' | 'gasLimit' | 'gasPrice' | 'maxFeePerGas' | 'maxPriorityFeePerGas'
> & {
  nonce?: ITxNonce;
  gasLimit?: ITxGasLimit;
  gasPrice?: ITxGasPrice;
  maxFeePerGas?: ITxGasPrice;
  maxPriorityFeePerGas?: ITxGasPrice;
};
type TxBeforeGasLimit = DistributiveOmit<ITxObject, 'nonce' | 'gasLimit'> & {
  nonce?: ITxNonce;
  gasLimit?: ITxGasLimit;
};
type TxBeforeNonce = DistributiveOmit<ITxObject, 'nonce'> & { nonce?: ITxNonce };
type TxResponseBeforeBroadcast = DistributiveOmit<TransactionResponse, 'confirmations' | 'wait'> & {
  confirmations?: number;
  wait?(confirmations?: number): Promise<TransactionReceipt>;
};

const formatGas = (tx: ITxObject) =>
  isType2Tx(tx)
    ? {
        maxFeePerGas: BigNumber.from(tx.maxFeePerGas),
        maxPriorityFeePerGas: BigNumber.from(tx.maxPriorityFeePerGas),
        type: tx.type
      }
    : { gasPrice: BigNumber.from(tx.gasPrice) };

export const toTxReceipt = (txHash: ITxHash, status: ITxHistoryStatus) => (
  txType: ITxType,
  txConfig: ITxConfig,
  metadata?: ITxMetadata
): ITxReceipt => {
  const { rawTransaction, asset, baseAsset, amount } = txConfig;
  const { data, gasLimit, nonce } = rawTransaction;

  const gas = formatGas(rawTransaction);

  const txReceipt = {
    ...gas,
    hash: txHash,
    from: getAddress(txConfig.from) as TAddress,
    receiverAddress: (txConfig.receiverAddress && getAddress(txConfig.receiverAddress)) as TAddress,
    gasLimit: BigNumber.from(gasLimit),
    value: BigNumber.from(txConfig.rawTransaction.value),
    to: (txConfig.rawTransaction.to && getAddress(txConfig.rawTransaction.to)) as TAddress,
    nonce: BigNumber.from(nonce),

    status,
    amount,
    data,
    txType,
    asset,
    baseAsset,
    blockNumber: 0,
    timestamp: 0,
    metadata
  };
  return txReceipt;
};

export const makePendingTxReceipt = (txHash: ITxHash) => (
  txType: ITxType,
  txConfig: ITxConfig,
  metadata?: ITxMetadata
): IPendingTxReceipt =>
  toTxReceipt(txHash, ITxStatus.PENDING)(txType, txConfig, metadata) as IPendingTxReceipt;

export const makeUnknownTxReceipt = (txHash: ITxHash) => (
  txType: ITxType,
  txConfig: ITxConfig,
  metadata?: ITxMetadata
): IPendingTxReceipt =>
  toTxReceipt(txHash, ITxStatus.UNKNOWN)(txType, txConfig, metadata) as IPendingTxReceipt;

export const makeFinishedTxReceipt = (
  previousTxReceipt: IPendingTxReceipt,
  newStatus: ITxStatus.FAILED | ITxStatus.SUCCESS,
  timestamp: number = 0,
  blockNumber: number = 0,
  gasUsed?: BigNumber,
  confirmations?: number
): IFinishedTxReceipt => ({
  ...previousTxReceipt,
  status: newStatus,
  timestamp: timestamp,
  blockNumber: blockNumber,
  gasUsed,
  confirmations
});

const getGasPriceFromTx = (tx: {
  type?: number | null;
  maxFeePerGas?: BigNumber | string;
  maxPriorityFeePerGas?: BigNumber | string;
  gasPrice?: BigNumber | string;
}) =>
  // Possibly revisit this when more tx types are available
  tx.type && tx.type === 2
    ? {
        maxFeePerGas: hexlify(tx.maxFeePerGas!, { hexPad: 'left' }) as ITxGasPrice,
        maxPriorityFeePerGas: hexlify(tx.maxPriorityFeePerGas!, { hexPad: 'left' }) as ITxGasPrice,
        type: tx.type
      }
    : { gasPrice: hexlify(tx.gasPrice!, { hexPad: 'left' }) as ITxGasPrice };

const buildRawTxFromSigned = (signedTx: BytesLike): ITxObject => {
  const decodedTx = parseTransaction(signedTx);

  return {
    to: decodedTx.to as ITxToAddress | undefined,
    from: decodedTx.from as TAddress,
    data: decodedTx.data as ITxData,
    ...getGasPriceFromTx(decodedTx),
    value: decodedTx.value.toHexString() as ITxValue,
    nonce: hexlify(decodedTx.nonce) as ITxNonce,
    gasLimit: decodedTx.gasLimit.toHexString() as ITxGasLimit,
    chainId: decodedTx.chainId,
    // @todo Cleaner way of doing this?
    type: decodedTx.type as any
  };
};

export const makeBasicTxConfig = (
  rawTransaction: ITxObject,
  account: StoreAccount,
  amount: string
): ITxConfig => {
  const { to } = rawTransaction;
  const { address, network } = account;
  const baseAsset = getAssetByUUID(account.assets)(network.baseAsset)!;

  const txConfig: ITxConfig = {
    from: address,
    amount,
    receiverAddress: to,
    senderAccount: account,
    networkId: network.id,
    asset: baseAsset,
    baseAsset,
    rawTransaction
  };

  return txConfig;
};

// needs testing
export const makeTxConfigFromSignedTx = (
  signedTx: BytesLike,
  assets: ExtendedAsset[],
  networks: Network[],
  accounts: StoreAccount[],
  networkId?: NetworkId
): ITxConfig => {
  const decodedTx = parseTransaction(signedTx);
  const networkDetected = getNetworkByChainId(decodedTx.chainId, networks)!;
  const contractAsset = getAssetByContractAndNetwork(decodedTx.to, networkDetected)(assets);
  const baseAsset = getBaseAssetByNetwork({
    network: networkDetected || ({} as Network),
    assets
  })!;

  const rawTransaction = buildRawTxFromSigned(signedTx);

  const txConfig: ITxConfig = {
    rawTransaction,
    receiverAddress: (contractAsset
      ? decodeTransfer(decodedTx.data)._to
      : decodedTx.to) as TAddress,
    amount: contractAsset
      ? fromTokenBase(toWei(decodeTransfer(decodedTx.data)._value, 0), contractAsset.decimal)
      : bigNumValueToViewableEther(decodedTx.value),
    networkId: networkDetected?.id ?? networkId,
    asset: contractAsset ?? baseAsset,
    baseAsset,
    senderAccount: getStoreAccount(accounts)(decodedTx.from as TAddress, networkDetected?.id)!,
    from: decodedTx.from as TAddress
  };
  return txConfig;
};

// needs testing
export const makeTxConfigFromTx = (
  decodedTx: TxResponseBeforeBroadcast | ITxObject,
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

  const hexConfig = { hexPad: 'left' as const };

  const txConfig: ITxConfig = {
    rawTransaction: {
      to: to && (getAddress(to) as ITxToAddress),
      value: hexlify(decodedTx.value, hexConfig) as ITxValue,
      gasLimit: hexlify(decodedTx.gasLimit, hexConfig) as ITxGasLimit,
      data: decodedTx.data as ITxData,
      nonce: hexlify(decodedTx.nonce, hexConfig) as ITxNonce,
      chainId: decodedTx.chainId,
      from: (decodedTx.from && getAddress(decodedTx.from)) as ITxFromAddress,
      ...getGasPriceFromTx(decodedTx),
      // @todo Cleaner way of doing this?
      type: decodedTx.type as any
    },
    receiverAddress: receiverAddress && (getAddress(receiverAddress) as TAddress),
    amount,
    networkId: network.id,
    asset,
    baseAsset,
    senderAccount: getStoreAccount(accounts)(decodedTx.from as TAddress, network.id)!,
    from: (decodedTx.from && getAddress(decodedTx.from)) as TAddress
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
  })!;

  const receiver = contractAsset ? decodeTransfer(txReceipt.data)._to : txReceipt.to;

  const txConfig = {
    rawTransaction: {
      to: txReceipt.to && (getAddress(txReceipt.to) as TAddress),
      value: BigNumber.from(txReceipt.value).toHexString() as ITxValue,
      gasLimit: BigNumber.from(txReceipt.gasLimit).toHexString() as ITxGasLimit,
      data: txReceipt.data as ITxData,
      ...getGasPriceFromTx(txReceipt),
      nonce: BigNumber.from(txReceipt.nonce).toHexString() as ITxNonce,
      chainId: network.chainId,
      from: getAddress(txReceipt.from) as TAddress,
      // @todo Cleaner way of doing this?
      type: txReceipt.type as any
    },
    receiverAddress: receiver && (getAddress(receiver) as TAddress),
    amount: contractAsset
      ? fromTokenBase(toWei(decodeTransfer(txReceipt.data)._value, 0), contractAsset.decimal)
      : txReceipt.amount,
    networkId: network.id,
    asset: contractAsset ?? baseAsset,
    baseAsset,
    senderAccount: getStoreAccount(accounts)(txReceipt.from, network.id)!,
    from: getAddress(txReceipt.from) as TAddress
  };
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
  toAddress: ITxToAddress | undefined,
  value: ITxValue,
  baseAsset: Asset,
  contractAsset?: Asset
) => {
  const isERC20 = ercType === ERCType.TRANSFER || ercType === ERCType.APPROVAL;
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
  toAddress: ITxToAddress | undefined,
  value: ITxValue
) => {
  switch (ercType) {
    case ERCType.TRANSFER: {
      const { _to, _value }: { _to: ITxToAddress | undefined; _value: ITxValue } = decodeTransfer(
        data
      );
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

export const appendGasPrice = (network: Network, account: StoreAccount) => async (
  tx: TxBeforeGasPrice
): Promise<TxBeforeGasLimit> => {
  // Respect gas price if present
  if (tx.gasPrice || (tx.maxFeePerGas && tx.maxPriorityFeePerGas)) {
    return tx as TxBeforeGasLimit;
  }
  const gas = await fetchUniversalGasPriceEstimate(network, account)
    .then(({ estimate: r }) => mapObjIndexed((v) => v && inputGasPriceToHex(v), r))
    .catch((err) => {
      throw new Error(`getGasPriceEstimate: ${err}`);
    });

  // @todo Remove type cast if possible?
  return {
    ...tx,
    ...gas
  } as TxBeforeGasLimit;
};

export const appendGasLimit = (network: Network) => async (
  tx: TxBeforeGasLimit
): Promise<TxBeforeNonce> => {
  // Respect gas limit if present
  if (tx.gasLimit) {
    return tx as TxBeforeNonce;
  }
  try {
    const gasLimit = await getGasEstimate(network, tx).then(inputGasLimitToHex);

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
  if (!transaction.r || !transaction.s || transaction.v === undefined) {
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

export const makeTxFromForm = (
  form: Pick<
    ISimpleTxFormFull,
    | 'network'
    | 'gasPrice'
    | 'maxFeePerGas'
    | 'maxPriorityFeePerGas'
    | 'account'
    | 'address'
    | 'gasLimit'
    | 'nonce'
  >,
  value: string,
  data: ITxData
): ITxObject => {
  const gas =
    form.account && isEIP1559Supported(form.network, form.account)
      ? {
          maxFeePerGas: inputGasPriceToHex(form.maxFeePerGas),
          maxPriorityFeePerGas: inputGasPriceToHex(form.maxPriorityFeePerGas),
          type: 2 as const
        }
      : {
          gasPrice: inputGasPriceToHex(form.gasPrice)
        };

  return {
    ...gas,
    from: form.account?.address,
    to: form.address as ITxToAddress,
    value: inputValueToHex(value),
    data: data,
    gasLimit: inputGasLimitToHex(form.gasLimit),
    nonce: inputNonceToHex(form.nonce),
    chainId: form.network.chainId
  };
};
