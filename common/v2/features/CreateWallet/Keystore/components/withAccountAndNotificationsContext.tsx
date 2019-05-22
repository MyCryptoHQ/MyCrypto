import React from 'react';

import { AccountContext, NotificationsContext } from 'v2/providers';

export const withAccountAndNotificationsContext = (Component: any) => (props: any) => (
  <AccountContext.Consumer>
    {({ createAccount }) => (
      <NotificationsContext.Consumer>
        {({ displayNotification }) => (
          <Component
            {...props}
            createAccount={createAccount}
            displayNotification={displayNotification}
          />
        )}
      </NotificationsContext.Consumer>
    )}
  </AccountContext.Consumer>
);
