import React, { createContext, useEffect, useMemo, useState } from 'react';

import { DEFAULT_NETWORK } from '@config';
import { UniClaimResult } from '@services/ApiService/Uniswap/Uniswap';
import { addAccounts, deleteMembership, useDispatch } from '@store';
import {
  Asset,
  Bigish,
  IAccount,
  Network,
  StoreAccount,
  StoreAsset,
  TUuid,
  WalletId
} from '@types';
import { bigify, convertToFiatFromAsset, isArrayEqual, useInterval } from '@utils';
import { isEmpty, isEmpty as isVoid, prop, sortBy, uniqBy } from '@vendor';

import { UniswapService } from '../ApiService';
import { getDashboardAccounts, useAccounts } from './Account';
import { getTotalByAsset, useAssets } from './Asset';
import { getAccountsAssetsBalances } from './BalanceService';
import { isNotExcludedAsset } from './helpers';
import { useNetworks } from './Network';
import { useSettings } from './Settings';

export interface State {
  readonly accounts: StoreAccount[];
  readonly networks: Network[];
  readonly currentAccounts: StoreAccount[];
  readonly userAssets: Asset[];
  readonly uniClaims: UniClaimResult[];
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

  const mainnetAccounts = accounts
    .filter((a) => a.networkId === DEFAULT_NETWORK)
    .map((a) => a.address);

  // Uniswap UNI token claims
  const [uniClaims, setUniClaims] = useState<UniClaimResult[]>([]);

  useEffect(() => {
    if (mainnetAccounts.length > 0) {
      UniswapService.instance.getClaims(mainnetAccounts).then((rawClaims) => {
        if (rawClaims !== null) {
          UniswapService.instance
            .isClaimed(networks.find((n) => n.id === DEFAULT_NETWORK)!, rawClaims)
            .then((claims) => {
              setUniClaims(claims);
            });
        }
      });
    }
  }, [mainnetAccounts.length]);

  const state: State = {
    accounts,
    networks,
    currentAccounts,
    accountRestore,
    uniClaims,
    get userAssets() {
      const userAssets = state.accounts
        .filter((a: StoreAccount) => a.wallet !== WalletId.VIEW_ONLY)
        .flatMap((a: StoreAccount) => a.assets)
        .filter(isNotExcludedAsset(settings.excludedAssets));
      const uniq = uniqBy(prop('uuid'), userAssets);
      return sortBy(prop('ticker'), uniq);
    },
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
