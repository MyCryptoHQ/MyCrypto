import { Overwrite } from 'utility-types';

import { AssetBalanceObject, StoreAsset } from './asset';
import { Network } from './network';
import { NetworkId } from './networkId';
import { WalletId } from './walletId';
import { ITxReceipt } from './transaction';

export interface Account {
  label?: string;
  address: string;
  networkId: NetworkId;
  assets: AssetBalanceObject[];
  wallet: WalletId;
  transactions: ITxReceipt[];
  dPath: string;
  mtime: number;
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

export type StoreAccount = Overwrite<
  ExtendedAccount,
  {
    assets: StoreAsset[];
  }
> & { network: Network };
