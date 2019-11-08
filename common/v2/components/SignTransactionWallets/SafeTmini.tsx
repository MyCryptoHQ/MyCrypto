import React from 'react';

import SafeTIcon from 'common/assets/images/icn-safet-mini-new.svg';
import { ISignComponentProps } from 'v2/types';
import HardwareSignTransaction from './Hardware';

export default function SignTransactionSafeT({
  senderAccount,
  rawTransaction,
  onSuccess
}: ISignComponentProps) {
  return (
    <HardwareSignTransaction
      walletIcon={SafeTIcon}
      signerDescription={
        'Connect your Safe-T Mini to your computer and enter your Safe-T Mini PIN when prompted to sign your transaction.'
      }
      senderAccount={senderAccount}
      rawTransaction={rawTransaction}
      onSuccess={onSuccess}
    />
  );
}
