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
      walletIconType={'ledger-icon-lg'}
      senderAccount={senderAccount}
      rawTransaction={rawTransaction}
      onSuccess={onSuccess}
    />
  );
}
