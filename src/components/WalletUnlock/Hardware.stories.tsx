import React from 'react';

import { fNetwork } from '@fixtures';
import { WalletId } from '@types';
import { noOp } from '@utils';

import HardwareWalletUI, { HardwareUIProps } from './Hardware';

export default { title: 'Features/AddAccount/Hardware', components: HardwareWalletUI };

const initialProps: Omit<HardwareUIProps, 'walletId'> = {
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

const createInitialProps = (walletId: WalletId.LEDGER_NANO_S_NEW | WalletId.TREZOR_NEW) => ({
  ...initialProps,
  walletId
});

export const LedgerUnlockUI = () => {
  return (
    <div className="sb-container" style={{ maxWidth: '620px' }}>
      <HardwareWalletUI {...createInitialProps(WalletId.LEDGER_NANO_S_NEW)} />
    </div>
  );
};

export const TrezorUnlockUI = () => {
  return (
    <div className="sb-container" style={{ maxWidth: '620px' }}>
      <HardwareWalletUI {...createInitialProps(WalletId.TREZOR_NEW)} />
    </div>
  );
};
