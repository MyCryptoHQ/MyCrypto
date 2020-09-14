import React from 'react';

import { NotificationsProvider, ErrorProvider } from '@features';
import { SettingsProvider, DataProvider } from '@services/Store';

import { DevToolsProvider, StoreProvider, FeatureFlagProvider, RatesProvider } from '@services';

function AppProviders({ children }: { children: JSX.Element[] | JSX.Element | null }) {
  return (
    <FeatureFlagProvider>
      <DevToolsProvider>
        <ErrorProvider>
          <DataProvider>
            <SettingsProvider>
              <NotificationsProvider>
                {/* StoreProvider relies on the others Providers */}
                <StoreProvider>
                  {/* RatesProvider relies on the Store */}
                  <RatesProvider>{children}</RatesProvider>
                </StoreProvider>
              </NotificationsProvider>
            </SettingsProvider>
          </DataProvider>
        </ErrorProvider>
      </DevToolsProvider>
    </FeatureFlagProvider>
  );
}

export default AppProviders;
