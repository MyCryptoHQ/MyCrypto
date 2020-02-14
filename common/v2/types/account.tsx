import { Overwrite } from 'utility-types';

import { AssetBalanceObject, StoreAsset } from './asset';
import { Network } from './network';
import { NetworkId } from './networkId';
import { WalletId } from './walletId';
import { ITxReceipt } from './transaction';
import { TUuid } from './uuid';
import { TAddress } from './address';

export interface Account {
  label?: string;
  address: TAddress;
  networkId: NetworkId;
  assets: AssetBalanceObject[];
  wallet: WalletId;
  transactions: ITxReceipt[];
  dPath: string;
  mtime: number;
  favorite: boolean;
}

export interface ExtendedAccount extends Account {
  uuid: TUuid;
}

export interface AssetBalanceObject {
  uuid: TUuid;
  balance: string;
  timestamp: number;
}

export type StoreAccount = Overwrite<
  ExtendedAccount,
  {
    assets: StoreAsset[];
  }
> & { network: Network };
