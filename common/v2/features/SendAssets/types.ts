import { FunctionComponent } from 'react';
import {
  Asset,
  ExtendedAccount as IExtendedAccount,
  Network as INetwork,
  GasEstimates,
  ExtendedAccount
} from 'v2/types';

export type ISignedTx = string;

export interface ITxObject {
  readonly to: string;
  readonly gasLimit: string;
  readonly gasPrice: string;
  readonly nonce: string;
  readonly data: string;
  readonly value: string;
  readonly chainId: number;
}

export interface ITxConfig {
  readonly gasLimit: string;
  readonly gasPrice: string;
  readonly nonce: string;
  readonly amount: string;
  readonly value: string;
  readonly to: string;
  readonly chainId: number;
  readonly data: string;
  readonly receiverAddress: string;
  readonly senderAccount: IExtendedAccount;
  readonly asset: Asset;
  readonly network: INetwork;
}

export interface ITxReceipt {
  [index: string]: any;
}

export interface ITxData {
  readonly hash: string;
  readonly network: INetwork;
  readonly asset: Asset | undefined;

  readonly amount: string;
  readonly value: string;
  readonly to: string;
  readonly from: string;
  readonly nonce: number;

  readonly gasLimit: string; // Hex
  readonly gasPrice: string; // Hex - wei
  readonly data: string; // Hex
}

export interface IFormikFields {
  asset: Asset;
  receiverAddress: string;
  amount: string;
  account: IExtendedAccount;
  txDataField: string;
  gasEstimates: GasEstimates;
  gasPriceField: string;
  gasPriceSlider: string;
  gasLimitField: string;
  nonceField: string; // Use only if user has input a manual nonce value.
  network: INetwork;
  advancedTransaction: boolean;
  resolvedENSAddress: string; // Address returned when attempting to resolve an ENS/RNS address.
}

export interface ISignComponentProps {
  network: INetwork;
  senderAccount: ExtendedAccount;
  rawTransaction: ITxObject;
  children?: never;
  onSuccess(receipt: ITxReceipt | ISignedTx): void;
}

export interface IStepComponentProps {
  txConfig: ITxConfig;
  txReceipt?: ITxReceipt;
  signedTx?: ISignedTx;
  children?: never;
  onComplete(data: IFormikFields | ITxReceipt | ISignedTx | null): void;
}

export type TStepAction = (payload: any, after: () => void) => void;

export interface IPath {
  label: string;
  component: FunctionComponent<IStepComponentProps>;
  action: TStepAction;
}

export interface IConfirmConfig {
  amount: string; // '0.01'
  asset: Asset; // {} as Asset
  chainId: number; // 1
  data: string; // '0x0'
  gasLimit: string; // '21000'
  gasPrice: string; // '100000000'
  network: INetwork | undefined; // {} as Network
  nonce: string; // '13'
  receiverAddress: string; // '0xc7bFC8A6bD4e52bFE901764143abeF76Caf2f912'
  senderAccount: ExtendedAccount | undefined; // {} as ExtendedAccount
  to: string; // '0xc7bFC8A6bD4e52bFE901764143abeF76Caf2f912'
  value: string; // '0.00'
  from: string; // '0xc7bFC8A6bD4e52bFE901764143abeF76Caf2f912'
}
