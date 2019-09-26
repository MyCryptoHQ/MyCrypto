import React from 'react';

import { ISignComponentProps } from '../../types';
import ConnectTrezor from 'common/assets/images/icn-connect-trezor-new.svg';
import HardwareSignTransaction from './Hardware';

export default function SignTransactionTrezor({
  senderAccount,
  rawTransaction,
  onSuccess
}: ISignComponentProps) {
  return (
    <HardwareSignTransaction
      signerDescription={
        'Connect your Trezor to your computer and enter your Trezor PIN when prompted to sign your transaction.'
      }
      walletIcon={ConnectTrezor}
      senderAccount={senderAccount}
      rawTransaction={rawTransaction}
      onSuccess={onSuccess}
    />
  );
}
