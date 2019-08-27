import { TWalletType } from './wallets';
import { WalletName } from './wallet';
import { ITxReceipt } from 'v2/features/SendAssets/types';

export interface Account {
  label?: string;
  address: string;
  network: string;
  assets: AssetBalanceObject[];
  wallet: WalletName | TWalletType;
  balance: string;
  transactions: ITxReceipt[];
  dPath: string;
  timestamp: number;
  favorite: boolean;
}

export interface ExtendedAccount extends Account {
  uuid: string;
}

export interface AssetBalanceObject {
  uuid: string;
  balance: string;
  timestamp: number;
}
