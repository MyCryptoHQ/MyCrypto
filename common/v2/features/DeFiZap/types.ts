import { ITxConfig, ITxReceipt, Asset, Network, StoreAccount } from 'v2/types';
import { IZapConfig } from './config';

export type TStepAction = (payload: any, after: () => void) => void;

export interface IDeFiStepComponentProps {
  completeButtonText: string;
  resetFlow(): void;
  onComplete(payload?: any): void;
}

export interface ZapInteractionState {
  zapSelected: undefined | IZapConfig; // ToDo: Make enum
  txConfig: ITxConfig;
  txReceipt: ITxReceipt | undefined;
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
  network: Network;
}
