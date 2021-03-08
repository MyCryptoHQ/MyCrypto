import React from 'react';

import { ErrorProvider } from '@features';
import { DevToolsProvider, StoreProvider } from '@services';
import { DataProvider } from '@services/Store';

function AppProviders({ children }: { children: JSX.Element[] | JSX.Element | null }) {
  return (
    <DevToolsProvider>
      <ErrorProvider>
        <DataProvider>
          {/* StoreProvider relies on the others Providers */}
          <StoreProvider>{children}</StoreProvider>
        </DataProvider>
      </ErrorProvider>
    </DevToolsProvider>
  );
}

export default AppProviders;
