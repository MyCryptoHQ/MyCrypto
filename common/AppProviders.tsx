import React from 'react';

import { NotificationsProvider } from 'features';
import {
  AccountProvider,
  AddressBookProvider,
  AssetProvider,
  NetworkProvider,
  SettingsProvider
} from 'services/Store';
import { RatesProvider, StoreProvider } from 'services';

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
