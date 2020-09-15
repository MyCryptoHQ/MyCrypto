import React from 'react';

import ConnectTrezor from '@assets/images/icn-connect-trezor-new.svg';
import { translateRaw } from '@translations';
import { ISignComponentProps } from '@types';

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
