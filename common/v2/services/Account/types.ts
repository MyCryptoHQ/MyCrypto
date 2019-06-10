import { WalletName } from 'v2/config/data';
import { assetMethod } from '../Asset/types';

export interface Account {
  label: string;
  address: string;
  network: string;
  assets: AssetBalanceObject[];
  wallet: WalletName;
  balance: number;
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
}
