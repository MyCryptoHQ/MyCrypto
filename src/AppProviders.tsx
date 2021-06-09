import React from 'react';

import { ErrorProvider } from '@features';
import { DevToolsProvider, StoreProvider } from '@services';

function AppProviders({ children }: { children: JSX.Element[] | JSX.Element | null }) {
  return (
    <DevToolsProvider>
      <ErrorProvider>
        {/* StoreProvider relies on the others Providers */}
        <StoreProvider>{children}</StoreProvider>
      </ErrorProvider>
    </DevToolsProvider>
  );
}

export default AppProviders;
