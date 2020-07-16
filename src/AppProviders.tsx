import React from 'react';

import { NotificationsProvider, ToastProvider, ErrorProvider } from '@features';
import {
  AccountProvider,
  AddressBookProvider,
  AssetProvider,
  NetworkProvider,
  SettingsProvider,
  ContractProvider,
  DataProvider
} from '@services/Store';
import { DevToolsProvider, RatesProvider, StoreProvider, FeatureFlagProvider } from '@services';

function AppProviders({ children }: { children: JSX.Element[] | JSX.Element | null }) {
  return (
    <FeatureFlagProvider>
      <DevToolsProvider>
        <ErrorProvider>
          <DataProvider>
            <SettingsProvider>
              <AccountProvider>
                <NotificationsProvider>
                  <ToastProvider>
                    <NetworkProvider>
                      <ContractProvider>
                        <AddressBookProvider>
                          <AssetProvider>
                            {/* StoreProvider relies on the others Providers */}
                            <StoreProvider>
                              {/* RatesProvider relies on the Store */}
                              <RatesProvider>{children}</RatesProvider>
                            </StoreProvider>
                          </AssetProvider>
                        </AddressBookProvider>
                      </ContractProvider>
                    </NetworkProvider>
                  </ToastProvider>
                </NotificationsProvider>
              </AccountProvider>
            </SettingsProvider>
          </DataProvider>
        </ErrorProvider>
      </DevToolsProvider>
    </FeatureFlagProvider>
  );
}

export default AppProviders;
