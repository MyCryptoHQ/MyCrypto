import { Asset, IAccount, StoreAccount, NetworkId, TAddress } from '@types';
import { DEFAULT_NETWORK } from '@config';
import { isSameAddress } from '@utils';

export const getDashboardAccounts = (
  accounts: StoreAccount[],
  currentAccounts: string[]
): StoreAccount[] => {
  return accounts
    .filter((account) => account && 'uuid' in account)
    .filter(({ uuid }) => currentAccounts.indexOf(uuid) >= 0);
};

export const getAccountByAddressAndNetworkName = (accounts: IAccount[]) => (
  address: string,
  networkId: NetworkId
): IAccount | undefined => {
  return accounts.find(
    (account) =>
      isSameAddress(account.address, address as TAddress) && account.networkId === networkId
  );
};

export const getAccountsByAsset = (
  accounts: StoreAccount[],
  { uuid: targetUuid }: Asset
): StoreAccount[] =>
  accounts.filter(({ assets }) => assets.find(({ uuid }) => uuid === targetUuid));

export const getBaseAsset = (account: StoreAccount) =>
  account.assets.find((a) => a.type === 'base');

export const isEthereumAccount = (account: StoreAccount | IAccount) =>
  account.networkId === DEFAULT_NETWORK;

export const isAccountInNetwork = (account: StoreAccount | IAccount, networkIdToFilter: string) =>
  account.networkId === networkIdToFilter;
