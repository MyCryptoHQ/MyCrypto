import { DerivationPath } from '@mycrypto/wallets';
import { Overwrite } from 'utility-types';

import { TAddress } from './address';
import { AssetBalanceObject, StoreAsset } from './asset';
import { Network } from './network';
import { NetworkId } from './networkId';
import { ITxReceipt } from './transaction';
import { TUuid } from './uuid';
import { WalletId } from './walletId';

export interface IAccount {
  uuid: TUuid;
  label?: string;
  address: TAddress;
  networkId: NetworkId;
  assets: AssetBalanceObject[];
  wallet: WalletId;
  transactions: ITxReceipt[];

  path?: DerivationPath;
  index?: number;

  mtime: number;
  favorite: boolean;
  isPrivate?: boolean;
}

export type StoreAccount = Overwrite<
  IAccount,
  {
    assets: StoreAsset[];
  }
> & {
  network: Network;
  label: string;
};
