import React from 'react';

import {
  AccountProvider,
  AddressBookProvider,
  NetworksProvider,
  NotificationsProvider,
  RatesProvider,
  SettingsProvider,
  StoreProvider,
  AssetProvider
} from 'v2/providers';

function AppProviders({ children }: { children: JSX.Element[] | JSX.Element | null }) {
  return (
    <SettingsProvider>
      <AddressBookProvider>
        <AccountProvider>
          <NotificationsProvider>
            <NetworksProvider>
              <RatesProvider>
                <AssetProvider>
                  {/* StoreProvider relies on the others and should be last */}
                  <StoreProvider>{children}</StoreProvider>
                </AssetProvider>
              </RatesProvider>
            </NetworksProvider>
          </NotificationsProvider>
        </AccountProvider>
      </AddressBookProvider>
    </SettingsProvider>
  );
}

export default AppProviders;
