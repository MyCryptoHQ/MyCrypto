import React, { useContext, useEffect } from 'react';
import { Route, Redirect } from 'react-router';
import { FormData } from 'v2/features/AddAccount/types';
import { getNetworkByName, getNewDefaultAssetTemplateByNetwork, generateUUID } from 'v2/libs';
import { AccountContext, NotificationsContext, SettingsContext } from 'v2/providers';
import { Network } from 'v2/services/Network/types';
import { Account } from 'v2/services/Account/types';
import { NotificationTemplates } from 'v2/providers/NotificationsProvider/constants';
import { Asset } from 'v2/services/Asset/types';
import { createAssetWithID } from 'v2/services';
import { getAccountByAddress } from 'v2/libs/accounts/accounts';

/*
  Create a new account in localStorage and redirect to dashboard.
*/
function SaveAndRedirect(payload: { formData: FormData }) {
  const { createAccountWithID } = useContext(AccountContext);
  const { settings, updateSettingsAccounts } = useContext(SettingsContext);
  const { displayNotification } = useContext(NotificationsContext);
  useEffect(() => {
    const network: Network | undefined = getNetworkByName(payload.formData.network);
    if (!network || getAccountByAddress(payload.formData.account)) {
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
        label: 'New Account', // @TODO: we really should have the correct label before!
        transactions: [],
        timestamp: 0
      };
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
