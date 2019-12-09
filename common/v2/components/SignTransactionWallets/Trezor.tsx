import React from 'react';

import { ISignComponentProps } from 'v2/types';
import { translateRaw } from 'v2/translations';
import ConnectTrezor from 'common/assets/images/icn-connect-trezor-new.svg';
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
