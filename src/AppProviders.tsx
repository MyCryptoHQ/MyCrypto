import React from 'react';

import { ToastProvider, ErrorProvider } from '@features';
import {
  AccountProvider,
  AddressBookProvider,
  AssetProvider,
  NetworkProvider,
  SettingsProvider,
  ContractProvider,
  DataProvider
} from '@services/Store';
import { DevToolsProvider, RatesProvider, StoreProvider } from '@services';

function AppProviders({ children }: { children: JSX.Element[] | JSX.Element | null }) {
  return (
    <DevToolsProvider>
      <ErrorProvider>
        <DataProvider>
          <SettingsProvider>
            <AccountProvider>
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
            </AccountProvider>
          </SettingsProvider>
        </DataProvider>
      </ErrorProvider>
    </DevToolsProvider>
  );
}

export default AppProviders;
