import { Brand, Overwrite } from 'utility-types';
import BN from 'bn.js';
import { BigNumber } from 'ethers/utils';

import { Wei, Address } from '@services/EthService';

import { Asset } from './asset';
import {
  ITxType,
  ITxStatus,
  ITxToAddress,
  ITxValue,
  ITxGasPrice,
  ITxData,
  ITxNonce,
  ITxFromAddress
} from './transactionFlow';
import { TAddress } from './address';

// By only dealing with Buffers / BN, dont have to mess around with cleaning strings
export interface ITransaction {
  to: Address;
  from?: Address;
  value?: Wei | undefined;
  data?: Buffer | undefined;
  gasLimit: Wei;
  gasPrice: Wei;
  nonce: BN;
  chainId: number;
  v: Buffer;
  r: Buffer;
  s: Buffer;
}

export interface IHexStrTransaction {
  to: ITxToAddress;
  value: ITxValue;
  data: ITxData;
  gasLimit: any; // number? string?
  gasPrice: ITxGasPrice;
  nonce: ITxNonce;
  chainId: number;
}

export interface IHexStrWeb3Transaction {
  from: ITxFromAddress;
  to: ITxToAddress;
  value: ITxValue;
  data: ITxData;
  gas: string; // 21000 - not hex
  gasPrice: ITxGasPrice;
  nonce: ITxNonce;
  chainId: number;
}

export type ITxHash = Brand<string, 'TxHash'>;

export type ITxSigned = Brand<Uint8Array, 'TxSigned'>;

export interface ITxReceipt {
  readonly asset: Asset;
  readonly baseAsset: Asset;
  readonly txType: ITxType;
  readonly status: ITxStatus.PENDING | ITxStatus.SUCCESS | ITxStatus.FAILED | ITxStatus.UNKNOWN;

  readonly receiverAddress: TAddress;
  readonly amount: string;
  readonly data: string;

  readonly gasPrice: BigNumber;
  readonly gasLimit: BigNumber;
  readonly to: TAddress;
  readonly from: TAddress;
  readonly value: BigNumber;
  readonly nonce: string;
  readonly hash: ITxHash;
  readonly blockNumber?: number;
  readonly timestamp?: number;

  readonly gasUsed?: BigNumber;
  readonly confirmations?: number;
}

export type IPendingTxReceipt = Overwrite<ITxReceipt, { status: ITxStatus.PENDING }>;

export type IUnknownTxReceipt = Overwrite<ITxReceipt, { status: ITxStatus.UNKNOWN }>;

export type ISuccessfulTxReceipt = Overwrite<
  ITxReceipt,
  { status: ITxStatus.SUCCESS; timestamp: number; blockNumber: number }
>;

export type IFailedTxReceipt = Overwrite<
  ITxReceipt,
  { status: ITxStatus.FAILED; timestamp: number; blockNumber: number }
>;
