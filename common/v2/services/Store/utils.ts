import { bigNumberify, BigNumber } from 'ethers/utils';

import { TAddress, NetworkId, Asset, StoreAccount } from 'v2/types';

// Every StoreAccount has a base asset and a balance
const getAccountBaseBalance = (account: StoreAccount) =>
  account.assets.find(as => as.type === 'base')!.balance;

const getAccountTokenBalance = (account: StoreAccount, token: Asset): BigNumber => {
  const erc20 = account.assets.find(as => as.uuid === token.uuid);
  return erc20 ? erc20.balance : bigNumberify(0);
};

export const getAccountBalance = (account: StoreAccount, token?: Asset): BigNumber =>
  token ? getAccountTokenBalance(account, token) : getAccountBaseBalance(account);

export const getStoreAccount = (accounts: StoreAccount[]) => (
  address: TAddress,
  networkId: NetworkId
) =>
  accounts.find(
    a => a.address.toLowerCase() === address.toLowerCase() && a.networkId === networkId
  );
