import React from 'react';

import { ISignComponentProps } from 'v2/types';
import { translateRaw } from 'v2/translations';

import HardwareSignTransaction from './Hardware';
import SafeTIcon from 'common/assets/images/icn-safet-mini-new.svg';

export default function SignTransactionSafeT({
  senderAccount,
  rawTransaction,
  onSuccess
}: ISignComponentProps) {
  return (
    <HardwareSignTransaction
      walletIcon={SafeTIcon}
      signerDescription={translateRaw('SIGN_TX_SAFE_T_MINI_DESCRIPTION')}
      senderAccount={senderAccount}
      rawTransaction={rawTransaction}
      onSuccess={onSuccess}
    />
  );
}
