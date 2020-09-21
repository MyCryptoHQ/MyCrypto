import React from 'react';

import { ErrorProvider } from '@features';
import { DevToolsProvider, FeatureFlagProvider, RatesProvider, StoreProvider } from '@services';
import { DataProvider } from '@services/Store';

function AppProviders({ children }: { children: JSX.Element[] | JSX.Element | null }) {
  return (
    <FeatureFlagProvider>
      <DevToolsProvider>
        <ErrorProvider>
          <DataProvider>
            {/* StoreProvider relies on the others Providers */}
            <StoreProvider>
              {/* RatesProvider relies on the Store */}
              <RatesProvider>{children}</RatesProvider>
            </StoreProvider>
          </DataProvider>
        </ErrorProvider>
      </DevToolsProvider>
    </FeatureFlagProvider>
  );
}

export default AppProviders;
