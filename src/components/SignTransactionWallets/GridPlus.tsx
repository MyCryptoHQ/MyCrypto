import { TIcon } from '@components/Icon';
import { HARDWARE_CONFIG } from '@config';
import { translateRaw } from '@translations';
import { ISignComponentProps, WalletId } from '@types';

import HardwareSignTransaction from './Hardware';

export default function SignTransactionGridPlus({
  senderAccount,
  rawTransaction,
  onSuccess
}: ISignComponentProps) {
  const walletIconType = HARDWARE_CONFIG[WalletId.GRIDPLUS].iconId as TIcon;
  return (
    <HardwareSignTransaction
      signerDescription={translateRaw('SIGN_TX_GRIDPLUS_DESCRIPTION')}
      walletIconType={walletIconType}
      senderAccount={senderAccount}
      rawTransaction={rawTransaction}
      onSuccess={onSuccess}
    />
  );
}
