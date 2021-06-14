import React, { createContext, useMemo, useState } from 'react';

import { addAccounts, deleteMembership, useDispatch } from '@store';
import { Asset, Bigish, IAccount, Network, StoreAccount, StoreAsset, TUuid } from '@types';
import { bigify, convertToFiatFromAsset, isArrayEqual, useInterval } from '@utils';
import { isEmpty, isEmpty as isVoid } from '@vendor';

import { getDashboardAccounts, useAccounts } from './Account';
import { getTotalByAsset, useAssets } from './Asset';
import { getAccountsAssetsBalances } from './BalanceService';
import { useNetworks } from './Network';
import { useSettings } from './Settings';

export interface State {
  readonly accounts: StoreAccount[];
  readonly networks: Network[];
  readonly currentAccounts: StoreAccount[];
  readonly accountRestore: { [name: string]: IAccount | undefined };
  assets(selectedAccounts?: StoreAccount[]): StoreAsset[];
  totals(selectedAccounts?: StoreAccount[]): StoreAsset[];
  totalFiat(
    selectedAccounts?: StoreAccount[]
  ): (getAssetRate: (asset: Asset) => number | undefined) => Bigish;
  deleteAccountFromCache(account: IAccount): void;
  restoreDeletedAccount(accountId: TUuid): void;
}
export const StoreContext = createContext({} as State);

// App Store that combines all data values required by the components such
// as accounts, currentAccount, tokens, and fiatValues etc.
export const StoreProvider: React.FC = ({ children }) => {
  const { accounts, updateAccounts, deleteAccount } = useAccounts();
  const { assets } = useAssets();
  const { settings, updateSettingsAccounts } = useSettings();
  const { networks } = useNetworks();
  const dispatch = useDispatch();

  const [accountRestore, setAccountRestore] = useState<{ [name: string]: IAccount | undefined }>(
    {}
  );

  const currentAccounts = useMemo(
    () => getDashboardAccounts(accounts, settings.dashboardAccounts),
    [accounts, settings.dashboardAccounts, assets]
  );

  // Naive polling to get the Balances of baseAsset and tokens for each account.
  useInterval(
    () => {
      // Pattern to cancel setState call if ever the component is unmounted
      // before the async requests completes.
      // @todo: extract into seperate hook e.g. react-use
      // https://www.robinwieruch.de/react-hooks-fetch-data
      if (isVoid(networks)) return;
      let isMounted = true;
      getAccountsAssetsBalances(currentAccounts).then((accountsWithBalances: StoreAccount[]) => {
        // Avoid the state change if the balances are identical.
        if (isMounted && !isArrayEqual(currentAccounts, accountsWithBalances.filter(Boolean))) {
          updateAccounts(accountsWithBalances);
        }
      });

      return () => {
        isMounted = false;
      };
    },
    60000,
    true,
    [networks]
  );

  const state: State = {
    accounts,
    networks,
    currentAccounts,
    accountRestore,
    assets: (selectedAccounts = state.accounts) =>
      selectedAccounts.flatMap((account: StoreAccount) => account.assets),
    totals: (selectedAccounts = state.accounts) =>
      Object.values(getTotalByAsset(state.assets(selectedAccounts))),
    totalFiat: (selectedAccounts = state.accounts) => (
      getAssetRate: (asset: Asset) => number | undefined
    ) =>
      state
        .totals(selectedAccounts)
        .reduce(
          (sum, asset) => sum.plus(bigify(convertToFiatFromAsset(asset, getAssetRate(asset)))),
          bigify(0)
        ),
    deleteAccountFromCache: (account) => {
      setAccountRestore((prevState) => ({ ...prevState, [account.uuid]: account }));
      deleteAccount(account);
      updateSettingsAccounts(
        settings.dashboardAccounts.filter((dashboardUUID) => dashboardUUID !== account.uuid)
      );
      dispatch(deleteMembership({ address: account.address, networkId: account.networkId }));
    },
    restoreDeletedAccount: (accountId) => {
      const account = accountRestore[accountId];
      if (isEmpty(account)) {
        throw new Error('Unable to restore account! No account with id specified.');
      }
      dispatch(addAccounts([account!]));
      setAccountRestore((prevState) => ({ ...prevState, [account!.uuid]: undefined }));
    }
  };

  return <StoreContext.Provider value={state}>{children}</StoreContext.Provider>;
};

export default StoreProvider;
