import React from 'react';

import { fNetwork } from '@fixtures';
import { noOp } from '@utils';

import { LedgerUnlockUI } from './Ledger';

export default { title: 'WalletUnlock/LedgerNanoS' };

const initialProps: React.ComponentProps<typeof LedgerUnlockUI> = {
  network: fNetwork,
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

export const LedgerPanel = () => {
  return (
    <div className="sb-container" style={{ maxWidth: '620px' }}>
      <LedgerUnlockUI {...initialProps} />
    </div>
  );
};
