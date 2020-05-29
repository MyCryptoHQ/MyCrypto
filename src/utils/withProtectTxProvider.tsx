import React from 'react';
import ProtectTxProvider from '@features/ProtectTransaction/ProtectTxProvider';

export function withProtectTxProvider() {
  return (Component: any) => (ownProps: any) => {
    return (
      <ProtectTxProvider>
        <Component {...ownProps} />
      </ProtectTxProvider>
    );
  };
}
