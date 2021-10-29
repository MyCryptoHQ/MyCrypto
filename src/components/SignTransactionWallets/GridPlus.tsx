import { translateRaw } from '@translations';
import { ISignComponentProps } from '@types';

import HardwareSignTransaction from './Hardware';

// @todo Update copy
export default function SignTransactionGridPlus({
  senderAccount,
  rawTransaction,
  onSuccess
}: ISignComponentProps) {
  return (
    <HardwareSignTransaction
      signerDescription={translateRaw('SIGN_TX_TREZOR_DESCRIPTION')}
      walletIconType="trezor-icon-lg"
      senderAccount={senderAccount}
      rawTransaction={rawTransaction}
      onSuccess={onSuccess}
    />
  );
}
