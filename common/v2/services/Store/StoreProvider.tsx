import React, { useState, useContext, useMemo, createContext } from 'react';

import { StoreAccount, StoreAsset, Network, TTicker } from 'v2/types';
import { isArrayEqual, useInterval } from 'v2/utils';

import { getAccountsAssetsBalances } from './BalanceService';
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
  scanTokens(): Promise<void>;
}
export const StoreContext = createContext({} as State);

// App Store that combines all data values required by the components such
// as accounts, currentAccount, tokens, and fiatValues etc.
export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const { accounts: rawAccounts, updateAccountAssets } = useContext(AccountContext);
  const { assets } = useContext(AssetContext);
  const { settings } = useContext(SettingsContext);
  const { networks } = useContext(NetworkContext);

  // We transform rawAccounts into StoreAccount. Since the operation is exponential to the number of
  // accounts, make sure it is done only when rawAccounts change.
  const storeAccounts = useMemo(() => getStoreAccounts(rawAccounts, assets, networks), [
    rawAccounts,
    assets,
    networks
  ]);
  const [accounts, setAccounts] = useState(storeAccounts);

  // Naive polling to get the Balances of baseAsset and tokens for each account.
  useInterval(
    () => {
      getAccountsAssetsBalances(accounts).then((accountsWithBalances: StoreAccount[]) => {
        // Avoid the state change if the balances are identical.
        if (isArrayEqual(accounts, accountsWithBalances)) return;
        setAccounts(accountsWithBalances);
      });
    },
    60000,
    true,
    [rawAccounts]
  );

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
    ],
    scanTokens: async () => {
      // TODO: Add support for other networks
      const ethAccounts = state.accounts.filter(account => account.networkId === 'Ethereum');
      const slicedAssets = assets.slice(0, 100); // TODO: Fetch all balances
      await Promise.all(ethAccounts.map(account => updateAccountAssets(account, slicedAssets)));
    }
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
  // - [x] handle ethScan polling.
  // - [x] handle ethScan accepted networks
  // - [x] handle other networks...
  // - [x] connect to view.
  // - [ ] worry about error handling.
  // - [ ] save to local storage

  return <StoreContext.Provider value={state}>{children}</StoreContext.Provider>;
};
