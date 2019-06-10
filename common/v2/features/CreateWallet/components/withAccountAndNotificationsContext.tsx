import React from 'react';

import { AccountContext, NotificationsContext, SettingsContext } from 'v2/providers';
import { createAssetWithID } from 'v2/services';

export const withAccountAndNotificationsContext = (Component: any) => (props: any) => (
  <AccountContext.Consumer>
    {({ createAccountWithID }) => (
      <SettingsContext.Consumer>
        {({ settings, updateSettingsAccounts }) => (
          <NotificationsContext.Consumer>
            {({ displayNotification }) => (
              <Component
                {...props}
                createAccountWithID={createAccountWithID}
                displayNotification={displayNotification}
                updateSettingsAccounts={updateSettingsAccounts}
                createAssetWithID={createAssetWithID}
                settings={settings}
              />
            )}
          </NotificationsContext.Consumer>
        )}
      </SettingsContext.Consumer>
    )}
  </AccountContext.Consumer>
);
