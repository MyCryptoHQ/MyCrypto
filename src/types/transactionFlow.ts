import { Brand } from 'utility-types';

import { IZapConfig } from '@features/DeFiZap/config';
import { IMembershipConfig } from '@features/PurchaseMembership/config';
import { IAssetPair } from '@features/SwapAssets/types';
import {
  Asset,
  GasEstimates,
  Network as INetwork,
  ITokenMigrationConfig,
  ITxReceipt,
  StoreAccount,
  TAddress,
  TxParcel,
  WalletId
} from '@types';

export type ISignedTx = string;

export type ITxToAddress = TAddress;
export type ITxFromAddress = TAddress;
export type ITxValue = Brand<string, 'Value'>; // Hex - wei
export type ITxGasLimit = Brand<string, 'GasLimit'>; // Hex
export type ITxGasPrice = Brand<string, 'GasPrice'>; // Hex - wei
export type ITxData = Brand<string, 'Data'>; // Hex
export type ITxNonce = Brand<string, 'Nonce'>; // Hex

export interface ITxObject {
  /* Raw Transaction Object */
  readonly to: ITxToAddress;
  readonly value: ITxValue;
  readonly gasLimit: ITxGasLimit;
  readonly data: ITxData;
  readonly gasPrice: ITxGasPrice;
  readonly nonce: ITxNonce;
  readonly chainId: number;
  readonly from?: ITxFromAddress;
}

export interface ITxConfig {
  readonly rawTransaction: ITxObject /* The rawTransaction object that will be signed */;
  readonly amount: string;
  readonly receiverAddress: TAddress; // Recipient of the send. NOT the tx's `to` address
  readonly senderAccount: StoreAccount;
  readonly from: TAddress;
  readonly asset: Asset;
  readonly baseAsset: Asset;
  readonly network: INetwork;
  readonly gasPrice: string;
  readonly gasLimit: string;
  readonly nonce: string;
  readonly data: string;
  readonly value: string;
}

export interface IFormikFields {
  asset: Asset;
  address: IReceiverAddress;
  amount: string;
  account: StoreAccount;
  txDataField: string;
  gasEstimates: GasEstimates;
  gasPriceField: string;
  gasPriceSlider: string;
  gasLimitField: string;
  nonceField: string; // Use only if user has input a manual nonce value.
  network: INetwork;
  advancedTransaction: boolean;
  isAutoGasSet: boolean;
}

export interface ISignComponentProps {
  network: INetwork;
  senderAccount: StoreAccount;
  rawTransaction: ITxObject;
  children?: never;
  onSuccess(receipt: ITxReceipt | ISignedTx): void;
}

export interface IDefaultStepComponentProps {
  completeButtonText?: string;
  resetFlow(): void;
  onComplete(payload?: IFormikFields | ITxReceipt | ISignedTx | null): void;
}

export interface IStepComponentProps extends IDefaultStepComponentProps {
  txConfig: ITxConfig;
  txReceipt?: ITxReceipt;
  signedTx?: string;
  txType?: ITxType;
  txQueryType?: TxQueryTypes;
  zapSelected?: IZapConfig;
  membershipSelected?: IMembershipConfig;
  children?: never;
}

export interface ITxReceiptStepProps {
  txConfig: ITxConfig;
  txReceipt?: ITxReceipt;
  signedTx?: string;
  txQueryType?: TxQueryTypes;
  zapSelected?: IZapConfig;
  membershipSelected?: IMembershipConfig;
  children?: never;
  completeButtonText?: string;
  onComplete(data: IFormikFields | ITxReceipt | ISignedTx | null): void;
  resetFlow(): void;
}

export interface IReceiverAddress {
  display: string;
  value: string;
}

export type SigningComponents = {
  readonly [k in WalletId]: React.ComponentType<ISignComponentProps> | null;
};

export type ITxHistoryStatus =
  | ITxStatus.PENDING
  | ITxStatus.SUCCESS
  | ITxStatus.FAILED
  | ITxStatus.UNKNOWN;

export enum ITxStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  PENDING = 'PENDING',

  EMPTY = 'EMPTY',
  PREPARING = 'PREPARING',
  READY = 'READY',
  SIGNED = 'SIGNED',
  BROADCASTED = 'BROADCASTED',
  CONFIRMING = 'CONFIRMING',
  CONFIRMED = 'CONFIRMED',

  UNKNOWN = 'UNKNOWN'
}

export enum ITxType {
  UNKNOWN = 'UNKNOWN',
  STANDARD = 'STANDARD',
  SWAP = 'SWAP',
  DEFIZAP = 'DEFIZAP',
  CONTRACT_INTERACT = 'CONTRACT_INTERACT',
  DEPLOY_CONTRACT = 'DEPLOY_CONTRACT',
  PURCHASE_MEMBERSHIP = 'PURCHASE_MEMBERSHIP',
  APPROVAL = 'APPROVAL',
  REP_TOKEN_MIGRATION = 'REP_TOKEN_MIGRATION'
}

export interface ISimpleTxForm {
  address: string; // simple eth address
  amount: string; // in ether - ex: 1
  gasLimit: string | number; // number - ex: 1,500,000
  gasPrice: string; // gwei
  nonce: string; // number - ex: 55
  account: StoreAccount;
}

export interface ISimpleTxFormFull extends ISimpleTxForm {
  asset: Asset;
  network: INetwork;
}

export type TStepAction = (payload: any, after: () => void) => void;

export enum TxQueryTypes {
  SPEEDUP = 'speedup',
  CANCEL = 'cancel',
  DEFAULT = 'default'
}

export type IFlowConfig = ITokenMigrationConfig | IMembershipConfig | IAssetPair;

export interface ITxMultiConfirmProps {
  currentTxIdx: number;
  transactions: TxParcel[];
  flowConfig: IFlowConfig;
  onComplete?(): void;
}
