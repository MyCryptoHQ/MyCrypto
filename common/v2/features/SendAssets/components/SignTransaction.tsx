import React from 'react';

import {
  WalletId,
  ITxReceipt,
  IStepComponentProps,
  ISignComponentProps,
  ISignedTx
} from 'v2/types';
import { WALLET_STEPS } from 'v2/components';

export default function SignTransaction({ txConfig, onComplete }: IStepComponentProps) {
  const {
    network,
    senderAccount: { wallet: walletName }
  } = txConfig;

  const getWalletComponent = (walletType: WalletId) => {
    return WALLET_STEPS[walletType];
  };

  const WalletComponent: React.ComponentType<ISignComponentProps> = getWalletComponent(walletName)!;

  return (
    <WalletComponent
      network={network}
      senderAccount={txConfig.senderAccount}
      rawTransaction={txConfig.rawTransaction}
      onSuccess={(payload: ITxReceipt | ISignedTx) => onComplete(payload)}
    />
  );
}
