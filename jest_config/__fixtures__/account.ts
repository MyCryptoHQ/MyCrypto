import { StoreAccount, TUuid, TAddress, WalletId } from '@types';

import { fNetwork } from './network';
import { fAsset } from './assets';

export const fAccount: StoreAccount = {
  address: '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c' as TAddress,
  networkId: 'Ropsten',
  wallet: 'WALLETCONNECT' as WalletId,
  dPath: '',
  assets: [fAsset],
  transactions: [],
  favorite: false,
  mtime: 0,
  uuid: '4ffb0d4a-adf3-1990-5eb9-fe78e613f70b' as TUuid,
  network: fNetwork,
  label: 'WalletConnect Account 1'
};
