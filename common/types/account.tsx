import { Overwrite } from 'utility-types';

import { AssetBalanceObject, StoreAsset } from './asset';
import { Network } from './network';
import { NetworkId } from './networkId';
import { WalletId } from './walletId';
import { ITxReceipt } from './transaction';
import { TUuid } from './uuid';
import { TAddress } from './address';

export interface IAccount {
  uuid: TUuid;
  label?: string;
  address: TAddress;
  networkId: NetworkId;
  assets: AssetBalanceObject[];
  wallet: WalletId;
  transactions: ITxReceipt[];
  dPath: string;
  mtime: number;
  favorite: boolean;
  isPrivate?: boolean;
}

export type IRawAccount = Omit<IAccount, 'uuid'>;

export type StoreAccount = Overwrite<
  IAccount,
  {
    assets: StoreAsset[];
  }
> & {
  network: Network;
  label: string;
};
