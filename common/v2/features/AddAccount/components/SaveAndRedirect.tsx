import React, { useContext, useEffect } from 'react';
import { Route, Redirect } from 'react-router';

import { NotificationsContext, NotificationTemplates } from 'v2/features/NotificationsPanel';
import { generateUUID } from 'v2/utils';
import {
  AccountContext,
  SettingsContext,
  findNextUnusedDefaultLabel,
  createAddressBook,
  getNewDefaultAssetTemplateByNetwork,
  getNetworkById
} from 'v2/services/Store';
import { Account, AddressBook, Asset, Network, FormData } from 'v2/types';

/*
  Create a new account in localStorage and redirect to dashboard.
*/
function SaveAndRedirect(payload: { formData: FormData }) {
  const { createAccountWithID, getAccountByAddressAndNetworkName } = useContext(AccountContext);
  const { settings, updateSettingsAccounts } = useContext(SettingsContext);
  const { displayNotification } = useContext(NotificationsContext);
  useEffect(() => {
    const network: Network | undefined = getNetworkById(payload.formData.network);
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
      const newUUID = generateUUID();
      const account: Account = {
        address: payload.formData.account,
        networkId: payload.formData.network,
        wallet: payload.formData.accountType,
        dPath: payload.formData.derivationPath,
        assets: [{ uuid: newAsset.uuid, balance: '0', mtime: Date.now() }],
        transactions: [],
        favorite: false,
        mtime: 0
      };
      const newLabel: AddressBook = {
        label: findNextUnusedDefaultLabel(account.networkId),
        address: account.address,
        notes: '',
        network: account.networkId
      };
      createAddressBook(newLabel);
      createAccountWithID(account, newUUID);
      updateSettingsAccounts([...settings.dashboardAccounts, newUUID]);
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
