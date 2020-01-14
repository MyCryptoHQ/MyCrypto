import React from 'react';

import { ISignComponentProps } from 'v2/types';
import { translateRaw } from 'v2/translations';
import ledgerIcon from 'common/assets/images/icn-ledger-nano-large.svg';
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
