import React from 'react';

import { ISignComponentProps } from '@types';
import { translateRaw } from '@translations';
import ConnectSatochip from '@assets/images/icn-connect-satochip-new.svg';
import HardwareSignTransaction from './Hardware';

export default function SignTransactionSatochip({
  senderAccount,
  rawTransaction,
  onSuccess
}: ISignComponentProps) {
  return (
    <HardwareSignTransaction
      signerDescription={
        'Connect your Satochip to your computer and enter your Satochip PIN when prompted to sign your transaction.'
      }
      walletIcon={ConnectSatochip}
      senderAccount={senderAccount}
      rawTransaction={rawTransaction}
      onSuccess={onSuccess}
    />
  );
}
