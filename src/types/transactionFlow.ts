import { ComponentType } from 'react';

import { Brand } from 'utility-types';

import { IMembershipConfig } from '@features/PurchaseMembership/config';
import { IAssetPair } from '@features/SwapAssets/types';
import {
  Asset,
  Network as INetwork,
  ITokenMigrationConfig,
  ITxReceipt,
  StoreAccount,
  TAddress,
  TxParcel,
  WalletId
} from '@types';

import { NetworkId } from './networkId';

export type ISignedTx = string;

export type ITxToAddress = TAddress;
export type ITxFromAddress = TAddress;
export type ITxValue = Brand<string, 'Value'>; // Hex - wei
export type ITxGasLimit = Brand<string, 'GasLimit'>; // Hex
export type ITxGasPrice = Brand<string, 'GasPrice'>; // Hex - wei
export type ITxData = Brand<string, 'Data'>; // Hex
export type ITxNonce = Brand<string, 'Nonce'>; // Hex

export interface IBaseTxObject {
  readonly to?: ITxToAddress;
  readonly value: ITxValue;
  readonly gasLimit: ITxGasLimit;
  readonly data: ITxData;
  readonly nonce: ITxNonce;
  readonly chainId: number;
  readonly from?: ITxFromAddress;
}

export interface ILegacyTxObject extends IBaseTxObject {
  readonly gasPrice: ITxGasPrice;
  readonly type?: 0;
}

// @todo Rename?
export interface ITxType2Object extends IBaseTxObject {
  readonly maxFeePerGas: ITxGasPrice;
  readonly maxPriorityFeePerGas: ITxGasPrice;
  readonly type: 2;
}

export type ITxObject = ILegacyTxObject | ITxType2Object;

export interface ITxConfig {
  readonly rawTransaction: ITxObject /* The rawTransaction object that will be signed */;
  readonly amount: string;
  readonly receiverAddress?: TAddress; // Recipient of the send. NOT always the tx's `to` address
  readonly senderAccount: StoreAccount;
  readonly from: TAddress;
  readonly asset: Asset;
  readonly baseAsset: Asset;
  readonly networkId: NetworkId;
}

export interface IFormikFields {
  asset: Asset;
  address: IReceiverAddress;
  amount: string;
  account: StoreAccount;
  txDataField: string;
  gasPriceField: string;
  gasPriceSlider: string;
  gasLimitField: string;
  nonceField: string; // Use only if user has input a manual nonce value.
  network: INetwork;
  advancedTransaction: boolean;
  isAutoGasSet: boolean;
  maxFeePerGasField: string;
  maxPriorityFeePerGasField: string;
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
  error?: string;
  children?: never;
}

export interface ITxReceiptStepProps {
  txConfig: ITxConfig;
  txReceipt?: ITxReceipt;
  signedTx?: string;
  txQueryType?: TxQueryTypes;
  isTxStatus?: boolean;
  children?: never;
  completeButton?: string | (() => JSX.Element);
  onComplete(data: IFormikFields | ITxReceipt | ISignedTx | null): void;
  resetFlow(): void;
  setLabel?(label: string): void;
}

export interface IReceiverAddress {
  display: string;
  value: string;
}

export type SigningComponents = {
  readonly [k in WalletId]: ComponentType<ISignComponentProps> | null;
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
  REP_TOKEN_MIGRATION = 'REP_TOKEN_MIGRATION',
  AAVE_TOKEN_MIGRATION = 'AAVE_TOKEN_MIGRATION',
  ANT_TOKEN_MIGRATION = 'ANT_TOKEN_MIGRATION',
  GOLEM_TOKEN_MIGRATION = 'GOLEM_TOKEN_MIGRATION',
  FAUCET = 'FAUCET',
  ONE_INCH_EXCHANGE = 'ONE_INCH_EXCHANGE',
  AAVE_BORROW = 'AAVE_BORROW',
  AAVE_DEPOSIT = 'AAVE_DEPOSIT',
  AAVE_REPAY = 'AAVE_REPAY',
  AAVE_WITHDRAW = 'AAVE_WITHDRAW',
  COMPOUND_V2_BORROW = 'COMPOUND_V2_BORROW',
  COMPOUND_V2_DEPOSIT = 'COMPOUND_V2_DEPOSIT',
  COMPOUND_V2_REPAY = 'COMPOUND_V2_REPAY',
  COMPOUND_V2_WITHDRAW = 'COMPOUND_V2_WITHDRAW',
  DEX_AG_EXCHANGE = 'DEX_AG_EXCHANGE',
  ETHERMINE_MINING_PAYOUT = 'ETHERMINE_MINING_PAYOUT',
  GNOSIS_SAFE_APPROVE_TX = 'GNOSIS_SAFE_APPROVE_TX',
  GNOSIS_SAFE_WITHDRAW = 'GNOSIS_SAFE_WITHDRAW',
  IDEX_DEPOSIT_ETH = 'IDEX_DEPOSIT_ETH',
  IDEX_DEPOSIT_TOKEN = 'IDEX_DEPOSIT_TOKEN',
  IDEX_WITHDRAW = 'IDEX_WITHDRAW',
  KYBER_EXCHANGE = 'KYBER_EXCHANGE',
  MININGPOOLHUB_MINING_PAYOUT = 'MININGPOOLHUB_MINING_PAYOUT',
  PARASWAP_EXCHANGE = 'PARASWAP_EXCHANGE',
  SPARKPOOL_MINING_PAYOUT = 'SPARKPOOL_MINING_PAYOUT',
  UNISWAP_V1_DEPOSIT = 'UNISWAP_V1_DEPOSIT',
  UNISWAP_V1_EXCHANGE = 'UNISWAP_V1_EXCHANGE',
  UNISWAP_V1_WITHDRAW = 'UNISWAP_V1_WITHDRAW',
  UNISWAP_V2_DEPOSIT = 'UNISWAP_V2_DEPOSIT',
  UNISWAP_V2_EXCHANGE = 'UNISWAP_V2_EXCHANGE',
  UNISWAP_V2_ROUTER_TO = 'UNISWAP_V2_ROUTER_TO',
  UNISWAP_V2_WITHDRAW = 'UNISWAP_V2_WITHDRAW',
  WETH_UNWRAP = 'WETH_UNWRAP',
  WETH_WRAP = 'WETH_WRAP'
}

export interface ITxTypeMeta {
  type: string;
  protocol?: string;
}

export type TxType = Brand<string, 'TxType'>;

export interface ISimpleTxForm {
  address: string; // simple eth address
  amount: string; // in ether - ex: 1
  gasLimit: string | number; // number - ex: 1,500,000
  gasPrice: string; // gwei
  maxFeePerGas: string; // gwei
  maxPriorityFeePerGas: string; // gwei
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
  account: StoreAccount;
  onComplete?(): void;
  error?: string;
}
