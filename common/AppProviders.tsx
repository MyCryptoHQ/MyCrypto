import React from 'react';

import { NotificationsProvider } from 'v2/providers';
import {
  AccountProvider,
  AddressBookProvider,
  NetworkProvider,
  SettingsProvider
} from 'v2/services/Store';
import { RatesProvider, StoreProvider } from 'v2/services';

function AppProviders({ children }: { children: JSX.Element[] | JSX.Element | null }) {
  return (
    <SettingsProvider>
      <AddressBookProvider>
        <AccountProvider>
          <NotificationsProvider>
            <NetworkProvider>
              <RatesProvider>
                {/* StoreProvider relies on the others and should be last */}
                <StoreProvider>{children}</StoreProvider>
              </RatesProvider>
            </NetworkProvider>
          </NotificationsProvider>
        </AccountProvider>
      </AddressBookProvider>
    </SettingsProvider>
  );
}

export default AppProviders;
