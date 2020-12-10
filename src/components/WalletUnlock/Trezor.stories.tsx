import React from 'react';

import { noOp } from '@utils';

import { TrezorUnlockUI } from './NewTrezor';

export default { title: 'WalletUnlock/Trezor' };

const initialProps: React.ComponentProps<typeof TrezorUnlockUI> = {
  state: {
    isInit: false,
    isConnected: false,
    isConnecting: false,
    isGettingAccounts: false,
    queuedAccounts: [],
    finishedAccounts: [],
    customDPaths: [],
    session: undefined,
    promptConnectionRetry: false,
    completed: false,
    error: {
      code: '0x1111',
      message: 'A looooooong error message used to test the output of ledger connections.'
    }
  },
  handleNullConnect: noOp
};

export const TrezorPanel = () => {
  return (
    <div className="sb-container" style={{ maxWidth: '620px' }}>
      <TrezorUnlockUI {...initialProps} />
    </div>
  );
};
