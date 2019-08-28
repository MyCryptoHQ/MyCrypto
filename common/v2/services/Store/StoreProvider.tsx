import React, { useState, useEffect, useContext, createContext } from 'react';
import unionBy from 'lodash/unionBy';
import { bigNumberify } from 'ethers/utils';

import { ETHSCAN_NETWORKS } from 'v2/config';
import { StoreAccount, StoreAsset, Network } from 'v2/types';

import { getAccountBalance } from '../BalanceService';
import { getStoreAccounts } from './helpers';
import { AssetContext, getTotalByAsset } from './Asset';
import { AccountContext, getDashboardAccounts } from './Account';
import { SettingsContext } from './Settings';
import { NetworkContext } from './Network';

interface State {
  readonly accounts: StoreAccount[];
  readonly networks: Network[];
  tokens(): StoreAsset[];
  assets(selectedAccounts?: StoreAccount[]): StoreAsset[];
  totals(selectedAccounts?: StoreAccount[]): StoreAsset[];
  currentAccounts(): StoreAccount[];
}
export const StoreContext = createContext({} as State);

// App Store that combines all data values required by the components such
// as accounts, currentAccount, tokens, and fiatValues etc.
export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const { accounts: rawAccounts } = useContext(AccountContext);
  const { assets } = useContext(AssetContext);
  const { settings } = useContext(SettingsContext);
  const { networks } = useContext(NetworkContext);

  const [accounts, setAccounts] = useState(getStoreAccounts(rawAccounts, assets, networks));

  /*
    Currently this effect only fetches the values for Ethereum address once.
    Will be cleaned up once we handle other networks + polling.
  */
  useEffect(() => {
    (async function getAccountsBalances() {
      // for the moment EthScan is only deployed on Homestead.
      const supportedAccounts = accounts.filter(({ network }) =>
        ETHSCAN_NETWORKS.some(supportedNetwork => network.id === supportedNetwork)
      );
      const accountBalances = await Promise.all(supportedAccounts.map(getAccountBalance));

      const accountsWithBalances = accountBalances.map(([baseBalance, tokenBalances], index) => {
        const account = supportedAccounts[index];
        return {
          ...account,
          assets: account.assets
            // .filter(a => a.contractAddress || a.type === 'base')
            .map(asset => {
              switch (asset.type) {
                case 'base':
                  return {
                    ...asset,
                    balance: baseBalance[account.address].toString()
                  };
                case 'erc20':
                  return {
                    ...asset,
                    balance: tokenBalances[asset.contractAddress!].toString()
                  };
                default:
                  break;
              }
            })
            .map(asset => ({
              ...asset!,
              balance: bigNumberify(asset!.balance)
            }))
        };
      });
      // uniqueness of `accounts` is `address` + `network`, so we use `uuid`
      const updatedAccounts = unionBy(accountsWithBalances, accounts, 'uuid');
      setAccounts(updatedAccounts);
    })();
  }, [rawAccounts]); // only run if 'rawAccounts' changes

  const state: State = {
    accounts,
    networks,
    assets: (selectedAccounts = state.accounts) =>
      selectedAccounts.flatMap((account: StoreAccount) => account.assets),
    tokens: () => state.assets().filter(asset => asset.type !== 'base'),
    totals: (selectedAccounts = state.accounts) =>
      Object.values(getTotalByAsset(state.assets(selectedAccounts))),
    currentAccounts: () => getDashboardAccounts(state.accounts, settings.dashboardAccounts)
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
  // - [x] connect to view.
  // - [ ] worry about error handling.
  // - [ ] save to local storage

  return <StoreContext.Provider value={state}>{children}</StoreContext.Provider>;
};
