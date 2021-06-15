import React, { createContext, useState } from 'react';

import { addAccounts, deleteMembership, useDispatch } from '@store';
import { IAccount, TUuid } from '@types';
import { isEmpty } from '@vendor';

import { useAccounts } from './Account';
import { useSettings } from './Settings';

export interface State {
  readonly accountRestore: { [name: string]: IAccount | undefined };
  deleteAccountFromCache(account: IAccount): void;
  restoreDeletedAccount(accountId: TUuid): void;
}
export const StoreContext = createContext({} as State);

// App Store that combines all data values required by the components such
// as accounts, currentAccount, tokens, and fiatValues etc.
export const StoreProvider: React.FC = ({ children }) => {
  const { deleteAccount } = useAccounts();

  const { settings, updateSettingsAccounts } = useSettings();
  const dispatch = useDispatch();

  const [accountRestore, setAccountRestore] = useState<{ [name: string]: IAccount | undefined }>(
    {}
  );

  const state: State = {
    accountRestore,
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
