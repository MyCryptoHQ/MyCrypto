import React, { useContext } from 'react';

import { NotificationsContext } from '@features/NotificationsPanel';
import { AccountContext, SettingsContext, AssetContext } from '@services/Store';

export const withAccountAndNotificationsContext = (Component: any) => (props: any) => {
  const { createAccountWithID } = useContext(AccountContext);
  const { settings, updateSettingsAccounts } = useContext(SettingsContext);
  const { displayNotification } = useContext(NotificationsContext);
  const { createAssetWithID } = useContext(AssetContext);

  return (
    <Component
      {...props}
      createAccountWithID={createAccountWithID}
      displayNotification={displayNotification}
      updateSettingsAccounts={updateSettingsAccounts}
      createAssetWithID={createAssetWithID}
      settings={settings}
    />
  );
};
