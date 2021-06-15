import React, { createContext, useState } from 'react';

import { addAccounts, deleteMembership, useDispatch } from '@store';
import { Asset, Bigish, IAccount, Network, StoreAccount, StoreAsset, TUuid } from '@types';
import { bigify, convertToFiatFromAsset } from '@utils';
import { isEmpty } from '@vendor';

import { useAccounts } from './Account';
import { getTotalByAsset } from './Asset';
import { useNetworks } from './Network';
import { useSettings } from './Settings';

export interface State {
  readonly accounts: StoreAccount[];
  readonly networks: Network[];
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
  const { accounts, deleteAccount } = useAccounts();

  const { settings, updateSettingsAccounts } = useSettings();
  const { networks } = useNetworks();
  const dispatch = useDispatch();

  const [accountRestore, setAccountRestore] = useState<{ [name: string]: IAccount | undefined }>(
    {}
  );

  const state: State = {
    accounts,
    networks,
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
