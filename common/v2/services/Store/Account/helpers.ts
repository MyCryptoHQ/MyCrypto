import { Asset, ExtendedAccount, StoreAccount } from 'v2/types';

export const getDashboardAccounts = (
  accounts: StoreAccount[],
  currentAccounts: string[]
): StoreAccount[] => {
  return accounts
    .filter(account => account && 'uuid' in account)
    .filter(({ uuid }) => currentAccounts.indexOf(uuid) >= 0);
};

export const getAccountByAddressAndNetworkName = (accounts: ExtendedAccount[]) => (
  address: string,
  networkId: string
): ExtendedAccount | undefined => {
  return accounts.find(
    account =>
      account.address.toLowerCase() === address.toLowerCase() && account.networkId === networkId
  );
};

export const getAccountsByAsset = (
  accounts: StoreAccount[],
  { uuid: targetUuid }: Asset
): StoreAccount[] =>
  accounts.filter(({ assets }) => assets.find(({ uuid }) => uuid === targetUuid));

export const getBaseAsset = (account: StoreAccount) => account.assets.find(a => a.type === 'base');
