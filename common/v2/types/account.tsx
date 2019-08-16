import { Overwrite } from 'utility-types';

import { TWalletType } from './wallets';
import { WalletName } from './wallet';
import { Asset, TAssetType, AssetBalanceObject } from './asset';
import { Network } from './network';
import { NetworkId } from './networkId';

export interface Account {
  label?: string;
  address: string;
  networkId: NetworkId;
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

export type StoreAccount = Overwrite<
  ExtendedAccount,
  {
    assets: Asset[];
  }
> & { network: Network };

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
