import { DEFAULT_NETWORK } from '@config';
import { Asset, IAccount, NetworkId, StoreAccount, TAddress, WalletId } from '@types';
import { isSameAddress } from '@utils';

export const getAccountByAddressAndNetworkName = (accounts: IAccount[]) => (
  address: string,
  networkId: NetworkId
): IAccount | undefined => {
  return accounts.find(
    (account) =>
      isSameAddress(account.address, address as TAddress) && account.networkId === networkId
  );
};

export const getIdenticalAccount = (accounts: IAccount[]) => (
  address: string,
  networkId: NetworkId,
  walletId: WalletId
): IAccount | undefined => {
  return accounts.find(
    (account) =>
      isSameAddress(account.address, address as TAddress) &&
      account.networkId === networkId &&
      account.wallet === walletId
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
