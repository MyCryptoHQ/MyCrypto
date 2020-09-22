import React from 'react';

import ledgerIcon from '@assets/images/icn-ledger-nano-large.svg';
import { translateRaw } from '@translations';
import { ISignComponentProps } from '@types';

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
