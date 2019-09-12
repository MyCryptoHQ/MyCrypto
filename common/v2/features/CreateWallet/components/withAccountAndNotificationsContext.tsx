import React, { useContext } from 'react';

import { NotificationsContext } from 'v2/features/NotificationsPanel';
import { AccountContext, SettingsContext, createAssetWithID } from 'v2/services/Store';

export const withAccountAndNotificationsContext = (Component: any) => (props: any) => {
  const { createAccountWithID } = useContext(AccountContext);
  const { settings, updateSettingsAccounts } = useContext(SettingsContext);
  const { displayNotification } = useContext(NotificationsContext);

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
