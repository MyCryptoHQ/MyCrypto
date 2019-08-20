import React, { useState, useEffect, useContext, createContext } from 'react';
import unionBy from 'lodash/unionBy';

import { ETHSCAN_NETWORKS } from 'v2/config';
import {
  ExtendedAccount,
  StoreAccount,
  Asset,
  AssetBalanceObject,
  Network,
  NetworkId
} from 'v2/types';
import { AssetContext, AccountContext, NetworkContext } from './Store';
import { getAccountBalance } from './BalanceService';

const getNetworkById = (targetNetwork: NetworkId, networks: Network[]): Network => {
  return networks.find(n => n.id === targetNetwork || n.name === targetNetwork) as Network;
};

const getAssetsByUuid = (accountAssets: AssetBalanceObject[], assets: Asset[]): Asset[] => {
  return accountAssets.map(({ uuid }) => assets.find(a => a.uuid === uuid)) as Asset[];
};

const getFullAccounts = (
  accounts: ExtendedAccount[],
  assets: Asset[],
  networks: Network[]
): StoreAccount[] => {
  return accounts.map(a => ({
    ...a,
    assets: getAssetsByUuid(a.assets, assets),
    network: getNetworkById(a.networkId, networks)
  }));
};

interface State {
  readonly accounts: StoreAccount[];
  readonly networks: Network[];
  tokens(): Asset[];
}
export const StoreContext = createContext({} as State);

// App Store that combines all data values required by the components such
// as accounts, currentAccount, tokens, and fiatValues etc.
export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const { accounts: rawAccounts } = useContext(AccountContext);
  const { assets } = useContext(AssetContext);
  const { networks } = useContext(NetworkContext);

  const [accounts, setAccounts] = useState(getFullAccounts(rawAccounts, assets, networks));

  useEffect(() => {
    (async function getAccountsBalances() {
      // for the moment EthScan is only deployed on Homestead.
      const supportedAccounts = accounts.filter(({ network }) =>
        ETHSCAN_NETWORKS.some(supportedNetwork => network.id === supportedNetwork)
      );
      const accountWithBalances = await Promise.all(supportedAccounts.map(getAccountBalance));
      // uniqueness of `accounts` is `address` + `network`, so we use `uuid`
      const updatedAccounts = unionBy(accountWithBalances, accounts, 'uuid');
      setAccounts(updatedAccounts);
    })();
  }, [rawAccounts]); // only run if 'rawAccounts' changes

  const state: State = {
    accounts,
    networks,
    tokens: () => accounts.flatMap(account => account.assets).filter(asset => asset.type !== 'base')
  };

  // 1. I actually want to watch all the base and token balance for every
  // account, so the service should receive a list of accounts
  // and return an object of accounts with the updated balances.
  // 2. The store should save the updated accounts.
  // 3. The polling should run every minute.
  // ! Make sure to set the ethScan contractAddress to the correct value per network.
  // 4. With memozation.
  // 5. If it there is a change we update the store.
  // 6. At a different time we decompose accounts object and save it into LocalStorage

  // - [x] getBalances should be able to receive just address ? For AddAccount
  // - [x] getBalances network selection with fallbacks ?
  // - [x] update account.asset types
  // - [ ] handle ethScan polling.
  // - [x] handle ethScan accepted networks
  // - [ ] handle other networks...
  // - [ ] connect to view.
  // - [ ] worry about error handling.
  // - [ ] save to local storage

  return <StoreContext.Provider value={state}>{children}</StoreContext.Provider>;
};
