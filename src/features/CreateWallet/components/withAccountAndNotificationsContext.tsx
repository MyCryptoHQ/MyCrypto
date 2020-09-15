import React, { useContext } from 'react';

import { useNotifications } from '@features/NotificationsPanel';
import { useAccounts, SettingsContext, useAssets } from '@services/Store';

export const withAccountAndNotificationsContext = (Component: any) => (props: any) => {
  const { createAccountWithID } = useAccounts();
  const { settings, updateSettingsAccounts } = useContext(SettingsContext);
  const { displayNotification } = useNotifications();
  const { createAssetWithID } = useAssets();

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
