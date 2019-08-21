import React, { useContext, useEffect } from 'react';
import { Route, Redirect } from 'react-router';

import { FormData } from 'v2/features/AddAccount/types';
import { NotificationsContext } from 'v2/providers';
import { createAssetWithID } from 'v2/services';
import { NotificationTemplates } from 'v2/providers/NotificationsProvider/constants';
import { generateUUID } from 'v2/utils';
import {
  AccountContext,
  SettingsContext,
  findNextUnusedDefaultLabel,
  createAddressBook,
  getNewDefaultAssetTemplateByNetwork,
  getNetworkByName
} from 'v2/services/Store';
import { Account, AddressBook, Asset, Network } from 'v2/types';

/*
  Create a new account in localStorage and redirect to dashboard.
*/
function SaveAndRedirect(payload: { formData: FormData }) {
  const { createAccountWithID, getAccountByAddressAndNetworkName } = useContext(AccountContext);
  const { settings, updateSettingsAccounts } = useContext(SettingsContext);
  const { displayNotification } = useContext(NotificationsContext);
  useEffect(() => {
    const network: Network | undefined = getNetworkByName(payload.formData.network);
    if (
      !network ||
      !payload.formData.account ||
      !!getAccountByAddressAndNetworkName(payload.formData.account, payload.formData.network)
    ) {
      displayNotification(NotificationTemplates.walletNotAdded, {
        address: payload.formData.account
      });
    } else {
      const newAsset: Asset = getNewDefaultAssetTemplateByNetwork(network);
      const newAssetID: string = generateUUID();
      const newUUID = generateUUID();
      const account: Account = {
        address: payload.formData.account,
        network: payload.formData.network,
        wallet: payload.formData.accountType,
        dPath: payload.formData.derivationPath,
        assets: [{ uuid: newAssetID, balance: '0', timestamp: Date.now() }],
        balance: '0',
        transactions: [],
        timestamp: 0,
        favorite: false
      };
      const newLabel: AddressBook = {
        label: findNextUnusedDefaultLabel(account.network),
        address: account.address,
        notes: '',
        network: account.network
      };
      createAddressBook(newLabel);
      createAccountWithID(account, newUUID);
      updateSettingsAccounts([...settings.dashboardAccounts, newUUID]);
      createAssetWithID(newAsset, newAssetID);
      displayNotification(NotificationTemplates.walletAdded, {
        address: account.address
      });
    }
  });

  return (
    <Route>
      <Redirect to="/dashboard" />
    </Route>
  );
}

export default SaveAndRedirect;
