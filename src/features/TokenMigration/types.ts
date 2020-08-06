import { Asset, Network, StoreAccount } from '@types';
import { ITokenMigrationConfig } from './config';

export type TStepAction = (payload: any, after: () => void) => void;

export interface ITokenMigrationStepComponentProps {
  completeButtonText: string;
  resetFlow(): void;
  onComplete(payload?: any): void;
}

export interface TokenMigrationState {
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

export interface ITokenMigrationFormFull extends ISimpleTxFormFull {
  tokenConfig: ITokenMigrationConfig;
}
