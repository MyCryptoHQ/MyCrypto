import React from 'react';

import { Web3ProviderInstallUI } from './Web3ProviderInstall';

export default { title: 'WalletUnlock/Web3ProviderInstall' };

const initialProps = {
  isMobile: true
};

export const Web3ProviderInstall = () => {
  return (
    <div className="sb-container" style={{ maxWidth: '620px' }}>
      <Web3ProviderInstallUI {...initialProps} />
    </div>
  );
};
