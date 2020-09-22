import React from 'react';

import { useNotifications } from '@features/NotificationsPanel';
import { useAccounts, useAssets, useSettings } from '@services/Store';

export const withAccountAndNotificationsContext = (Component: any) => (props: any) => {
  const { createAccountWithID } = useAccounts();
  const { settings, updateSettingsAccounts } = useSettings();
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
