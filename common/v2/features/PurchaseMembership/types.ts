import { Asset, Network, StoreAccount } from '@types';
import { IMembershipConfig } from './config';

export type TStepAction = (payload: any, after: () => void) => void;

export interface IMembershipStepComponentProps {
  completeButtonText: string;
  resetFlow(): void;
  onComplete(payload?: any): void;
}

export interface MembershipPurchaseState {
  membershipSelected: undefined | IMembershipConfig; // ToDo: Make enum
  account: StoreAccount;
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

export interface MembershipSimpleTxFormFull extends ISimpleTxFormFull {
  membershipSelected: IMembershipConfig;
}
