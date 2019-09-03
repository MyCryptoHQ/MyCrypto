import React from 'react';

import { NotificationsProvider } from 'v2/providers';
import {
  AccountProvider,
  AddressBookProvider,
  AssetProvider,
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
              <AssetProvider>
                {/* StoreProvider relies on the others Providers */}
                <StoreProvider>
                  {/* RatesProvider relies on the Store */}
                  <RatesProvider>{children}</RatesProvider>
                </StoreProvider>
              </AssetProvider>
            </NetworkProvider>
          </NotificationsProvider>
        </AccountProvider>
      </AddressBookProvider>
    </SettingsProvider>
  );
}

export default AppProviders;
