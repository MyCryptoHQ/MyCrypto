import { WalletName } from 'v2/config/data';
import { TWalletType } from 'v2/types';
import { assetMethod } from '../Asset/types';

export interface Account {
  address: string;
  network: string;
  assets: AssetBalanceObject[];
  wallet: WalletName | TWalletType;
  balance: string;
  transactions: TransactionData[];
  dPath: string;
  timestamp: number;
}

export interface ExtendedAccount extends Account {
  uuid: string;
}

export interface TransactionData {
  txHash: string;
  stage: string;
  label: string;
  date: number;
  from: string;
  to: string;
  value: number;
  data: string;
  fiatValue: { USD: string };
  assetType: assetMethod;
}

export interface AssetBalanceObject {
  uuid: string;
  balance: string;
  timestamp: number;
}
