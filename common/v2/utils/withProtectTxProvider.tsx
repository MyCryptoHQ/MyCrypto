import React from 'react';
import { ProtectTxProvider } from 'v2/features/ProtectTransaction';

export function withProtectTxProvider() {
  return (Component: any) => (ownProps: any) => {
    return (
      <ProtectTxProvider>
        <Component {...ownProps} />
      </ProtectTxProvider>
    );
  };
}
