import React from 'react';

import { NotificationsProvider } from 'v2/features';
import {
  AccountProvider,
  AddressBookProvider,
  AssetProvider,
  NetworkProvider,
  SettingsProvider,
  ContractProvider
} from 'v2/services/Store';
import { DevToolsProvider, RatesProvider, StoreProvider } from 'v2/services';

function AppProviders({ children }: { children: JSX.Element[] | JSX.Element | null }) {
  return (
    <DevToolsProvider>
      <SettingsProvider>
        <AddressBookProvider>
          <AccountProvider>
            <NotificationsProvider>
              <NetworkProvider>
                <ContractProvider>
                  <AssetProvider>
                    {/* StoreProvider relies on the others Providers */}
                    <StoreProvider>
                      {/* RatesProvider relies on the Store */}
                      <RatesProvider>{children}</RatesProvider>
                    </StoreProvider>
                  </AssetProvider>
                </ContractProvider>
              </NetworkProvider>
            </NotificationsProvider>
          </AccountProvider>
        </AddressBookProvider>
      </SettingsProvider>
    </DevToolsProvider>
  );
}

export default AppProviders;
