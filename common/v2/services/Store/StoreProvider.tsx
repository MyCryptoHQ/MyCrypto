import React, { useState, useEffect, useContext, createContext } from 'react';
import { bigNumberify } from 'ethers/utils';

import { ETHSCAN_NETWORKS } from 'v2/config';
import { StoreAccount, StoreAsset, Network, TTicker } from 'v2/types';

import { getAccountBalance, otherAccountBalance } from '../BalanceService';
import { getStoreAccounts } from './helpers';
import { AssetContext, getTotalByAsset } from './Asset';
import { AccountContext, getDashboardAccounts } from './Account';
import { SettingsContext } from './Settings';
import { NetworkContext } from './Network';

interface State {
  readonly accounts: StoreAccount[];
  readonly networks: Network[];
  tokens(selectedAssets?: StoreAsset[]): StoreAsset[];
  assets(selectedAccounts?: StoreAccount[]): StoreAsset[];
  totals(selectedAccounts?: StoreAccount[]): StoreAsset[];
  currentAccounts(): StoreAccount[];
  assetTickers(targetAssets?: StoreAsset[]): TTicker[];
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
      // for the moment EthScan is only deployed on Ethereum.
      const supportedAccounts = accounts.filter(({ network }) =>
        ETHSCAN_NETWORKS.some(supportedNetwork => network.id === supportedNetwork)
      );
      const otherAccounts = accounts.filter(({ network }) =>
        ETHSCAN_NETWORKS.some(supportedNetwork => network.id !== supportedNetwork)
      );
      const balanceAccounts = [...supportedAccounts, ...otherAccounts];

      const balancePromises = [
        ...supportedAccounts.map(getAccountBalance),
        ...otherAccounts.map(otherAccountBalance)
      ];
      const accountBalances = await Promise.all(balancePromises);

      const accountsWithBalances = accountBalances.map(([baseBalance, tokenBalances], index) => {
        const account = balanceAccounts[index];
        return {
          ...account,
          assets: account.assets
            .map(asset => {
              switch (asset.type) {
                case 'base': {
                  const balance = baseBalance[account.address];
                  return {
                    ...asset,
                    balance: balance ? balance.toString() : asset.balance
                  };
                }
                case 'erc20': {
                  const balance = tokenBalances[asset.contractAddress!];
                  return {
                    ...asset,
                    balance: balance ? balance.toString() : asset.balance
                  };
                }
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
      // const updatedAccounts = unionBy(accountsWithBalances, accounts, 'uuid');
      // setAccounts(updatedAccounts);
      setAccounts(accountsWithBalances);
    })();
  }, [rawAccounts]); // only run if 'rawAccounts' changes

  const state: State = {
    accounts,
    networks,
    assets: (selectedAccounts = state.accounts) =>
      selectedAccounts.flatMap((account: StoreAccount) => account.assets),
    tokens: (selectedAssets = state.assets()) =>
      selectedAssets.filter((asset: StoreAsset) => asset.type !== 'base'),
    totals: (selectedAccounts = state.accounts) =>
      Object.values(getTotalByAsset(state.assets(selectedAccounts))),
    currentAccounts: () => getDashboardAccounts(state.accounts, settings.dashboardAccounts),
    assetTickers: (targetAssets = state.assets()) => [
      ...new Set(targetAssets.map(a => a.ticker as TTicker))
    ]
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
  // - [x] handle other networks...
  // - [x] connect to view.
  // - [ ] worry about error handling.
  // - [ ] save to local storage

  return <StoreContext.Provider value={state}>{children}</StoreContext.Provider>;
};
