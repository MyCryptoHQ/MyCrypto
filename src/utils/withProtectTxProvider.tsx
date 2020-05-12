import React from 'react';
import { ProtectTxProvider } from '@features/ProtectTransaction';

export function withProtectTxProvider() {
  return (Component: any) => (ownProps: any) => {
    return (
      <ProtectTxProvider>
        <Component {...ownProps} />
      </ProtectTxProvider>
    );
  };
}
