import { Brand, Overwrite } from 'utility-types';
import BN from 'bn.js';
import { BigNumber } from 'ethers/utils';

import { Wei, Address } from '@services/EthService';

import { Asset } from './asset';
import { ITxType, ITxStatus, ITxHistoryStatus } from './transactionFlow';
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
  to: string;
  value: string;
  data: string;
  gasLimit: any; // number? string?
  gasPrice: string;
  nonce: string;
  chainId: number;
}

export interface IHexStrWeb3Transaction {
  from: string;
  to: string;
  value: string;
  data: string;
  gas: string;
  gasPrice: string;
  nonce: string;
  chainId: number;
}

export type ITxHash = Brand<string, 'TxHash'>;

export type ITxSigned = Brand<Uint8Array, 'TxSigned'>;

export interface ITxReceipt {
  readonly asset: Asset;
  readonly baseAsset: Asset;
  readonly txType: ITxType;
  readonly status: ITxHistoryStatus;

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
}

export type IPendingTxReceipt = Overwrite<ITxReceipt, { status: ITxStatus.PENDING }>;

export type ISuccessfulTxReceipt = Overwrite<
  ITxReceipt,
  { status: ITxStatus.SUCCESS; timestamp: number; blockNumber: number }
>;

export type IFailedTxReceipt = Overwrite<
  ITxReceipt,
  { status: ITxStatus.FAILED; timestamp: number; blockNumber: number }
>;

/* MM - ETH
interface ITxWeb3ETHPending {
  rawTransaction: IHexStrTransaction;
  amount: string; // 0.01;
  senderAccount: StoreAccount;
  receiverAddress: string; // '0x5197b5b062288bbf29008c92b08010a92dd677cd'
  asset: Asset; // ETH Asset
  baseAsset: Asset; // ETH Asset
  from: string; // '0x5197b5b062288bbf29008c92b08010a92dd677cd'
  gasPrice: string; // '15000000000'
  gasLimit: string; // '21000'
  nonce: string; // '190'
  data: string; // '0x'
  value: string; // '10000000000000000'
  hash: string; // '0x6d5cbbe79dadaeba24822aeff7dd03edb525356d0ab322cd464c5bf0fc2564eb'
  to: string; // '0x5197b5b062288bbf29008c92b08010a92dd677cd'
  txType: ITxType; // 'STANDARD
  stage: ITxStatus; // 'PENDING
}

interface ITxWeb3ETHSuccessful {
  blockNumber: number; //10046229
  hash: string; // '0x6d5cbbe79dadaeba24822aeff7dd03edb525356d0ab322cd464c5bf0fc2564eb'
  from: string; // '0x5197B5b062288Bbf29008C92B08010a92Dd677CD'
  asset: Asset; // ETH Asset
  amount: string; // '0.01'
  to: string; // '0x5197B5b062288Bbf29008C92B08010a92Dd677CD'
  nonce: number; // 190
  gasLimit: BigNumber;
  gasPrice: BigNumber;
  data: string; // '0x'
  txType: ITxType; // 'STANDARD'
  timestamp: number; // 1589217878
  stage: ITxStatus; // 'SUCCESS'
}
*/

/* MM - ERC20 (DAI)
interface ITxWeb3ERC20Pending {
  rawTransaction: IHexStrTransaction;
  amount: string; // 0.01;
  senderAccount: StoreAccount;
  receiverAddress: string; // '0x5197b5b062288bbf29008c92b08010a92dd677cd'
  asset: Asset; // DAI Asset
  baseAsset: Asset; // ETH Asset
  from: string; // '0x5197b5b062288bbf29008c92b08010a92dd677cd'
  gasPrice: string; // '15000000000'
  gasLimit: string; // '32782'
  nonce: string; // '190'
  data: string; // '0xa9059cbb0000000000000000000000005197b5b062288bbf29008c92b08010a92dd677cd000000000000000000000000000000000000000000000000002386f26fc10000'
  value: string; // '0'
  hash: string; // '0x6d5cbbe79dadaeba24822aeff7dd03edb525356d0ab322cd464c5bf0fc2564eb'
  to: string; // '0x5197b5b062288bbf29008c92b08010a92dd677cd'
  txType: ITxType; // 'STANDARD
  stage: ITxStatus; // 'PENDING
}

interface ITxWeb3ERC20Successful {
  blockNumber: number; // 10046281
  hash: string; // '0x6d5cbbe79dadaeba24822aeff7dd03edb525356d0ab322cd464c5bf0fc2564eb'
  from: string; // '0x5197B5b062288Bbf29008C92B08010a92Dd677CD'
  asset: Asset; // DAI Asset
  amount: string; // '0.01'
  to: string; // '0x5197B5b062288Bbf29008C92B08010a92Dd677CD'
  nonce: number; // 190
  gasLimit: BigNumber;
  gasPrice: BigNumber;
  data: string; // '0xa9059cbb0000000000000000000000005197b5b062288bbf29008c92b08010a92dd677cd000000000000000000000000000000000000000000000000002386f26fc10000'
  txType: ITxType; // 'STANDARD'
  timestamp: number; // 1589217878
  stage: ITxStatus; // 'SUCCESS'
}
*/

/* Ledger - ETH
interface ITxLedgerETHPending {
  from: string; // '0x4d1F9d958AFa2e96dab3f3Ce7162b87daEa39017'
  gasLimit: BigNumber;
  gasPrice: BigNumber;
  nonce: number; // 190
  asset: Asset; // ETH Asset
  amount: string; // '0.01';
  data: string; // '0x'
  hash: string; // '0x9e5236a67a5d747358c1ffec33e7fcb74e22385347ab5e59fd4dbf0beefb2ea1'
  to: string; // '0x4d1F9d958AFa2e96dab3f3Ce7162b87daEa39017'
  txType: ITxType; // 'STANDARD
  stage: ITxStatus; // 'PENDING
}

interface ITxLedgerETHSuccessful {
  blockNumber: number ; // null - @todo: This is returning null atm.
  hash: string; // '0x9e5236a67a5d747358c1ffec33e7fcb74e22385347ab5e59fd4dbf0beefb2ea1'
  from: string; // '0x4d1F9d958AFa2e96dab3f3Ce7162b87daEa39017'
  asset: Asset; // DAI Asset
  amount: string; // '0.01'
  to: string; // '0x4d1F9d958AFa2e96dab3f3Ce7162b87daEa39017'
  nonce: number; // 190
  gasLimit: BigNumber;
  gasPrice: BigNumber;
  data: string; // '0x'
  txType: ITxType; // 'STANDARD'
  timestamp: number; // 1589219150
  stage: ITxStatus; // 'SUCCESS'
}
*/

/* Ledger - ERC20
interface ITxLedgerERC20Pending {
  hash: string; // '0x938a175c932512a187f4e3045828a64a2d7339459988080f5ac51e09620f09a1'
  from: string; // '0x4d1F9d958AFa2e96dab3f3Ce7162b87daEa39017'
  gasLimit: BigNumber;
  gasPrice: BigNumber;
  nonce: number; // 118
  asset: Asset; // USDT Asset
  amount: string; // '0.01';
  data: string; // '0x'
  to: string; // '0x4d1F9d958AFa2e96dab3f3Ce7162b87daEa39017'
  txType: ITxType; // 'STANDARD
  stage: ITxStatus; // 'PENDING
}

interface ITxLedgerERC20Successful {
  blockNumber: number ; // 10046348
  hash: string; // '0x9e5236a67a5d747358c1ffec33e7fcb74e22385347ab5e59fd4dbf0beefb2ea1'
  from: string; // '0x4d1F9d958AFa2e96dab3f3Ce7162b87daEa39017'
  asset: Asset; // USDT Asset
  amount: string; // '0.01'
  to: string; // '0x4d1F9d958AFa2e96dab3f3Ce7162b87daEa39017'
  nonce: number; // 118
  gasLimit: BigNumber;
  gasPrice: BigNumber;
  data: string; // '0xa9059cbb0000000000000000000000004d1f9d958afa2e96dab3f3ce7162b87daea390170000000000000000000000000000000000000000000000000000000000002710'
  txType: ITxType; // 'STANDARD'
  timestamp: number; // 1589219574
  stage: ITxStatus; // 'SUCCESS'
}
*/
