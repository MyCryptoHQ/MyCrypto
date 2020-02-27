import {
  Asset,
  Network as INetwork,
  GasEstimates,
  ITxReceipt,
  WalletId,
  StoreAccount
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
  readonly senderAccount: StoreAccount;
  readonly from: string;
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

export interface IStepComponentProps {
  txConfig: ITxConfig;
  txReceipt?: ITxReceipt;
  signedTx?: string;
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
export enum ITxStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  PENDING = 'PENDING'
}
