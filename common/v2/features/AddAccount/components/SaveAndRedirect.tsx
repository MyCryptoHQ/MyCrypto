import React, { useContext, useEffect } from 'react';
import { Route, Redirect } from 'react-router';
import { FormData } from 'v2/features/AddAccount/types';
import { AccountContext, NotificationsContext, CurrentsContext } from 'v2/providers';
import { getNetworkByName, generateUUID } from 'v2/libs';
import { NetworkOptions } from 'v2/services/NetworkOptions/types';
import { Account } from 'v2/services/Account/types';
import { NotificationTemplates } from 'v2/providers/NotificationsProvider/constants';

/*
  Create a new account in localStorage and redirect to dashboard.
*/
function SaveAndRedirect(payload: { formData: FormData }) {
  const { createAccountWithID } = useContext(AccountContext);
  const { currents, updateCurrentsAccounts } = useContext(CurrentsContext);
  const { displayNotification } = useContext(NotificationsContext);
  useEffect(() => {
    const network: NetworkOptions | undefined = getNetworkByName(payload.formData.network);
    const newUUID = generateUUID();
    const account: Account = {
      address: payload.formData.account,
      network: payload.formData.network,
      accountType: payload.formData.accountType,
      derivationPath: payload.formData.derivationPath,
      assets: network ? network.unit : 'DefaultAsset',
      value: 0,
      label: 'New Account', // @TODO: we really should have the correct label before!
      localSettings: 'default',
      transactionHistory: '',
      timestamp: 0
    };
    createAccountWithID(account, newUUID);
    updateCurrentsAccounts([...currents.accounts, newUUID]);
    displayNotification(NotificationTemplates.walletAdded, {
      address: account.address
    });
  });

  return (
    <Route>
      <Redirect to="/dashboard" />
    </Route>
  );
}

export default SaveAndRedirect;
