import React from 'react';

import ledgerIcon from '@assets/images/icn-ledger-nano-large.svg';
import { translateRaw } from '@translations';
import { ISignComponentProps } from '@types';

import HardwareSignTransaction from './Hardware';

export default function SignTransactionLedger({
  network,
  senderAccount,
  rawTransaction,
  onSuccess
}: ISignComponentProps) {
  return (
    <HardwareSignTransaction
      signerDescription={translateRaw('SIGN_TX_LEDGER_DESCRIPTION', {
        $network: network.id
      })}
      walletIcon={ledgerIcon}
      senderAccount={senderAccount}
      rawTransaction={rawTransaction}
      onSuccess={onSuccess}
    />
  );
}
