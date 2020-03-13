import React from 'react';

import { useWalletConnect } from './useWalletConnect';

export const withWalletConnect = (Component: any) => (ownProps: any) => {
  const useWalletConnectProps = useWalletConnect();
  return <Component {...ownProps} useWalletConnectProps={useWalletConnectProps} />;
};
