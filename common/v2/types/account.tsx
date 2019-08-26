import { TWalletType } from './wallets';
import { WalletName } from './wallet';
import { TAssetType } from './asset';

export interface Account {
  label?: string;
  address: string;
  network: string;
  assets: AssetBalanceObject[];
  wallet: WalletName | TWalletType;
  balance: string;
  transactions: TransactionData[];
  dPath: string;
  timestamp: number;
  favorite: boolean;
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
  assetType: TAssetType;
}

export interface AssetBalanceObject {
  uuid: string;
  balance: string;
  timestamp: number;
}
