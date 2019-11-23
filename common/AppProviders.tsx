import React from 'react';

import { NotificationsProvider, ToastProvider } from 'v2/features';
import {
  AccountProvider,
  AddressBookProvider,
  AssetProvider,
  NetworkProvider,
  SettingsProvider
} from 'v2/services/Store';
import { DevToolsProvider, RatesProvider, StoreProvider } from 'v2/services';

function AppProviders({ children }: { children: JSX.Element[] | JSX.Element | null }) {
  return (
    <DevToolsProvider>
      <SettingsProvider>
        <AddressBookProvider>
          <AccountProvider>
            <NotificationsProvider>
              <ToastProvider>
                <NetworkProvider>
                  <AssetProvider>
                    {/* StoreProvider relies on the others Providers */}
                    <StoreProvider>
                      {/* RatesProvider relies on the Store */}
                      <RatesProvider>{children}</RatesProvider>
                    </StoreProvider>
                  </AssetProvider>
                </NetworkProvider>
              </ToastProvider>
            </NotificationsProvider>
          </AccountProvider>
        </AddressBookProvider>
      </SettingsProvider>
    </DevToolsProvider>
  );
}

export default AppProviders;
