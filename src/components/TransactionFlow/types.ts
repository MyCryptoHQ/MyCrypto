import { BigNumber } from 'ethers/utils';

import { TAddress, StoreAsset, Network, StoreAccount } from '@types';

export interface ISender {
  address: TAddress;
  assets: StoreAsset[];
  network: Network;
  accountBalance?: BigNumber;
  account?: StoreAccount;
}
