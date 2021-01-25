import { BigNumber } from '@ethersproject/bignumber';

import { Asset, NetworkId, StoreAccount, TAddress } from '@types';
import { isSameAddress } from '@utils';

// Assume StoreAccount baseAsset balance to be 0 if asset does not exist.
const getAccountBaseBalance = (account: StoreAccount) => {
  const baseAsset = account.assets.find((as) => as.type === 'base');
  return baseAsset ? baseAsset.balance : BigNumber.from(0);
};

const getAccountTokenBalance = (account: StoreAccount, token: Asset): BigNumber => {
  const erc20 = account.assets.find((as) => as.uuid === token.uuid);
  return erc20 ? erc20.balance : BigNumber.from(0);
};

export const getAccountBalance = (account: StoreAccount, token?: Asset): BigNumber =>
  token ? getAccountTokenBalance(account, token) : getAccountBaseBalance(account);

export const getStoreAccount = (accounts: StoreAccount[]) => (
  address: TAddress,
  networkId: NetworkId
) => accounts.find((a) => isSameAddress(a.address, address) && a.networkId === networkId);
