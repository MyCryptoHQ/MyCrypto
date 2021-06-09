import React from 'react';

import { useWalletConnect } from './useWalletConnect';

export const withWalletConnect = (Component: any, autoKill: boolean = true) => (ownProps: any) => {
  const useWalletConnectProps = useWalletConnect(autoKill);
  return <Component {...ownProps} useWalletConnectProps={useWalletConnectProps} />;
};
