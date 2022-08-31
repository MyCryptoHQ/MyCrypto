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
      walletIconType="trezor-icon-lg"
      senderAccount={senderAccount}
      rawTransaction={rawTransaction}
      onSuccess={onSuccess}
    />
  );
}
