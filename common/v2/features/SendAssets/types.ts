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
  /* Raw Transaction Object */
  readonly to: string;
  readonly gasLimit: string;
  readonly gasPrice: string;
  readonly nonce: string;
  readonly data: string;
  readonly value: string;
  readonly chainId: number;
}

export interface ITxConfig {
  readonly rawTransaction: ITxObject /* The rawTransaction object that will be signed */;
  readonly amount: string;
  readonly receiverAddress: string;
  readonly senderAccount: IExtendedAccount;
  readonly from: string;
  readonly asset: Asset;
  readonly network: INetwork;
  readonly gasPrice: string;
  readonly gasLimit: string;
  readonly nonce: string;
  readonly data: string;
  readonly value: string;
}

export interface ITxReceipt {
  [index: string]: any;
}

export interface IReceiverAddress {
  display: string;
  value: string;
}

export interface IFormikFields {
  asset: Asset;
  receiverAddress: IReceiverAddress;
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
  children?: never;
  onComplete(data: IFormikFields | ITxReceipt | ISignedTx | null): void;
}

export type TStepAction = (payload: any, after: () => void) => void;

export interface IPath {
  label: string;
  component: FunctionComponent<IStepComponentProps>;
  action: TStepAction;
}
