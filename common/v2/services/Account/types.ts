import { WalletName } from 'v2/config/data';

export interface Account {
  label: string;
  address: string;
  network: string;
  localSettings: string;
  assets: string[];
  accountType: WalletName;
  value: number;
  transactionHistory: string;
  derivationPath: string;
}

export interface ExtendedAccount extends Account {
  uuid: string;
}
