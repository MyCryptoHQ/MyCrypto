import React from 'react';

import { FlowFooterConfig } from '@components/FlowFooter';
import { DEFAULT_NETWORK } from '@config';
import { fAccounts } from '@fixtures';
import { translateRaw } from '@translations';
import { WalletId } from '@types';

import { SignTxHardwareUI } from './Hardware';

export default { title: 'SignTransaction' };

const initialProps: React.ComponentProps<typeof SignTxHardwareUI> = {
  walletIconType: 'ledger-icon-lg',
  signerDescription: translateRaw('SIGN_TX_LEDGER_DESCRIPTION', {
    $network: DEFAULT_NETWORK
  }),
  wallet: FlowFooterConfig.LEDGER,
  senderAccount: { ...fAccounts[0], wallet: WalletId.LEDGER_NANO_S_NEW },
  isTxSignatureRequestDenied: true
};

export const HardwareWalletUI = () => {
  return (
    <div className="sb-container" style={{ maxWidth: '800px' }}>
      <SignTxHardwareUI {...initialProps} />
    </div>
  );
};
