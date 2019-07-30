import { FunctionComponent } from 'react';
import {
  Asset,
  IAsset,
  ExtendedAccount as IExtendedAccount,
  Network,
  GasEstimates
} from 'v2/types';

export interface ITxObject {
  readonly to: string;
  readonly from: string;
  readonly gasLimit: string;
  readonly gasPrice: string;
  readonly nonce: string;
  readonly data: string;
  readonly value: string;
  readonly chainId: number;
}

export interface ITxConfig {
  readonly gasLimit: string; // Move to BN
  readonly gasPrice: string; // Move to BN
  readonly nonce: string;
  readonly amount: string; // Move to BN
  readonly data: string;
  readonly receiverAddress: string; // Can't be an ExtendedAddressBook since recipient may not be registered
  readonly senderAccount: IExtendedAccount;
  readonly asset: IAsset | Asset;
  readonly network?: Network;
}

export interface ITxReceipt {
  [index: string]: any;
}

export interface IFormikFields {
  asset: Asset;
  receiverAddress: string;
  amount: string;
  account: IExtendedAccount;
  txDataField: string;
  gasEstimates: GasEstimates;
  gasPriceField: string; // Use only if advanced tab is open AND user has input gas price
  gasPriceSlider: string;
  gasLimitField: string; // Use only if advanced tab is open AND isGasLimitManual is true
  gasLimitEstimated: string;
  nonceField: string; // Use only if user has input a manual nonce value.
  nonceEstimated: string;
  network: Network;
  advancedTransaction: boolean;
  resolvedENSAddress: string; // Address returned when attempting to resolve an ENS/RNS address.
}

export interface ISignComponentProps {
  network: Network;
  rawTransaction: ITxObject;
  children?: never;
  onSuccess(receipt: ITxReceipt): void;
}

export interface IStepComponentProps {
  txConfig: ITxConfig;
  txReceipt?: ITxReceipt;
  children?: never;
  onComplete(data: IFormikFields | ITxReceipt | null): void;
}

export type TStepAction = (payload: any, after: () => void) => void;

export interface IPath {
  label: string;
  component: FunctionComponent<IStepComponentProps>;
  action: TStepAction;
}
