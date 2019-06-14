import React, { useContext, useEffect } from 'react';
import { Route, Redirect } from 'react-router';
import { FormData } from 'v2/features/AddAccount/types';
import {
  getNetworkByName,
  getNewDefaultAssetTemplateByNetwork,
  generateUUID,
  findNextUnusedDefaultLabel
} from 'v2/libs';
import { AccountContext, NotificationsContext, SettingsContext } from 'v2/providers';
import { Network } from 'v2/services/Network/types';
import { Account } from 'v2/services/Account/types';
import { NotificationTemplates } from 'v2/providers/NotificationsProvider/constants';
import { Asset } from 'v2/services/Asset/types';
import { createAssetWithID, createAddressBook, AddressBook } from 'v2/services';
import { getAccountByAddressAndNetwork } from 'v2/libs/accounts/accounts';

/*
  Create a new account in localStorage and redirect to dashboard.
*/
function SaveAndRedirect(payload: { formData: FormData }) {
  const { createAccountWithID } = useContext(AccountContext);
  const { settings, updateSettingsAccounts } = useContext(SettingsContext);
  const { displayNotification } = useContext(NotificationsContext);
  useEffect(() => {
    const network: Network | undefined = getNetworkByName(payload.formData.network);
    if (
      !network ||
      !!getAccountByAddressAndNetwork(payload.formData.account, payload.formData.network)
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
        assets: [{ uuid: newAssetID, balance: '0' }],
        balance: 0,
        transactions: [],
        timestamp: 0
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
