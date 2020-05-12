import React from 'react';

import { ISignComponentProps } from '@types';
import { translateRaw } from '@translations';
import ConnectTrezor from '@assets/images/icn-connect-trezor-new.svg';
import HardwareSignTransaction from './Hardware';

export default function SignTransactionTrezor({
  senderAccount,
  rawTransaction,
  onSuccess
}: ISignComponentProps) {
  return (
    <HardwareSignTransaction
      signerDescription={translateRaw('SIGN_TX_TREZOR_DESCRIPTION')}
      walletIcon={ConnectTrezor}
      senderAccount={senderAccount}
      rawTransaction={rawTransaction}
      onSuccess={onSuccess}
    />
  );
}
