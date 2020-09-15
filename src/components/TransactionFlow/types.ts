import { BigNumber } from 'ethers/utils';

import { Network, StoreAccount, StoreAsset, TAddress } from '@types';

export interface ISender {
  address: TAddress;
  assets: StoreAsset[];
  network: Network;
  accountBalance?: BigNumber;
  account?: StoreAccount;
}
