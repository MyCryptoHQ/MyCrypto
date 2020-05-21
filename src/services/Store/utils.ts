import { bigNumberify, BigNumber } from 'ethers/utils';

import { TAddress, NetworkId, Asset, StoreAccount } from '@types';

// Assume StoreAccount baseAsset balance to be 0 if asset does not exist.
const getAccountBaseBalance = (account: StoreAccount) => {
  const baseAsset = account.assets.find((as) => as.type === 'base');
  return baseAsset ? baseAsset.balance : bigNumberify(0);
};

const getAccountTokenBalance = (account: StoreAccount, token: Asset): BigNumber => {
  const erc20 = account.assets.find((as) => as.uuid === token.uuid);
  return erc20 ? erc20.balance : bigNumberify(0);
};

export const getAccountBalance = (account: StoreAccount, token?: Asset): BigNumber =>
  token ? getAccountTokenBalance(account, token) : getAccountBaseBalance(account);

export const getStoreAccount = (accounts: StoreAccount[]) => (
  address: TAddress,
  networkId: NetworkId
) =>
  accounts.find(
    (a) => a.address.toLowerCase() === address.toLowerCase() && a.networkId === networkId
  );
