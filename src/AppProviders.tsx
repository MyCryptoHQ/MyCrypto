import React from 'react';

import { ErrorProvider } from '@features';
import { SettingsProvider, DataProvider } from '@services/Store';

import { DevToolsProvider, StoreProvider, FeatureFlagProvider, RatesProvider } from '@services';

function AppProviders({ children }: { children: JSX.Element[] | JSX.Element | null }) {
  return (
    <FeatureFlagProvider>
      <DevToolsProvider>
        <ErrorProvider>
          <DataProvider>
            <SettingsProvider>
              {/* StoreProvider relies on the others Providers */}
              <StoreProvider>
                {/* RatesProvider relies on the Store */}
                <RatesProvider>{children}</RatesProvider>
              </StoreProvider>
            </SettingsProvider>
          </DataProvider>
        </ErrorProvider>
      </DevToolsProvider>
    </FeatureFlagProvider>
  );
}

export default AppProviders;
