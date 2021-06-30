import { BigNumber } from '@ethersproject/bignumber';

import { NetworkId, StoreAccount, StoreAsset, TAddress } from '@types';

export interface ISender {
  address: TAddress;
  assets: StoreAsset[];
  networkId: NetworkId;
  accountBalance?: BigNumber;
  account?: StoreAccount;
}
