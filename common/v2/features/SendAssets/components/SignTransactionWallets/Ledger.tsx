import React from 'react';

import { ISignComponentProps } from '../../types';
import ledgerIcon from 'common/assets/images/icn-ledger-nano-large.svg';
import HardwareSignTransaction from './Hardware';

export default function SignTransactionLedger({
  senderAccount,
  rawTransaction,
  onSuccess
}: ISignComponentProps) {
  return (
    <HardwareSignTransaction
      signerDescription={
        'Connect your Ledger to your computer and select the Network application to sign your transaction.'
      }
      walletIcon={ledgerIcon}
      senderAccount={senderAccount}
      rawTransaction={rawTransaction}
      onSuccess={onSuccess}
    />
  );
}
