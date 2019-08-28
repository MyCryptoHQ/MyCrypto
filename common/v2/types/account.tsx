import { Overwrite } from 'utility-types';

import { TWalletType } from './wallets';
import { WalletName } from './wallet';
import { TAssetType, AssetBalanceObject, StoreAsset } from './asset';
import { Network } from './network';
import { NetworkId } from './networkId';

export interface Account {
  label?: string;
  address: string;
  networkId: NetworkId;
  assets: AssetBalanceObject[];
  wallet: WalletName | TWalletType;
  transactions: TransactionData[];
  dPath: string;
  mtime: number;
  favorite: boolean;
}

export interface ExtendedAccount extends Account {
  uuid: string;
}

export type StoreAccount = Overwrite<
  ExtendedAccount,
  {
    assets: StoreAsset[];
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
