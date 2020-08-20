import React, { FC } from 'react';

import { WalletId, ITxReceipt, IStepComponentProps, ISignComponentProps, ISignedTx } from '@types';
import { WALLET_STEPS } from '@components';

const SignTransaction: FC<IStepComponentProps> = ({
  txConfig,
  onComplete
}: IStepComponentProps) => {
  const {
    network,
    senderAccount: { wallet: walletName }
  } = txConfig;

  const getWalletComponent = (walletType: WalletId) => {
    return WALLET_STEPS[walletType];
  };

  const WalletComponent: React.ComponentType<ISignComponentProps> = getWalletComponent(walletName)!;

  return (
    <>
      <WalletComponent
        network={network}
        senderAccount={txConfig.senderAccount}
        rawTransaction={txConfig.rawTransaction}
        onSuccess={(payload: ITxReceipt | ISignedTx) => onComplete(payload)}
      />
    </>
  );
};

export default SignTransaction;
