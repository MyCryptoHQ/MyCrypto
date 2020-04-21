import { Brand } from 'utility-types';
import BN from 'bn.js';

import { Wei, Address } from 'v2/services/EthService';
import { ITxStatus, ITxType } from './transactionFlow';
import { Asset } from './asset';
import { Network } from './network';
import { IAccount, StoreAccount, TAddress } from './index';

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

export enum ITxDirection {
  TRANSFER = 'TRANSFER',
  OUTBOUND = 'OUTBOUND',
  INBOUND = 'INBOUND'
}

export type ITxHash = Brand<string, 'TxHash'>;

export type ITxSigned = Brand<Uint8Array, 'TxSigned'>;

export interface ITxReceipt {
  readonly amount: string;
  readonly asset?: Asset;
  readonly to: TAddress;
  readonly from: TAddress;
  readonly hash: ITxHash;
  readonly blockNumber?: number;
  readonly value: string;
  readonly nonce: string;
  readonly gasLimit: string;
  readonly gasPrice: string;
  readonly data: string;
  readonly network?: Network;
  readonly type?: ITxType;
  readonly timestamp?: number;
  readonly stage?: ITxStatus;
  readonly senderAccount?: IAccount & StoreAccount;
  readonly direction?: ITxDirection;
}
