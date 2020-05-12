import React from 'react';

import { ISignComponentProps } from '@types';
import { translateRaw } from '@translations';
import ledgerIcon from '@assets/images/icn-ledger-nano-large.svg';
import HardwareSignTransaction from './Hardware';

export default function SignTransactionLedger({
  senderAccount,
  rawTransaction,
  onSuccess
}: ISignComponentProps) {
  return (
    <HardwareSignTransaction
      signerDescription={translateRaw('SIGN_TX_LEDGER_DESCRIPTION')}
      walletIcon={ledgerIcon}
      senderAccount={senderAccount}
      rawTransaction={rawTransaction}
      onSuccess={onSuccess}
    />
  );
}
