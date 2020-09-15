import React, { FC } from 'react';

import { WALLET_STEPS } from '@components';
import { ISignComponentProps, ISignedTx, IStepComponentProps, ITxReceipt, WalletId } from '@types';

type Props = Pick<IStepComponentProps, 'txConfig' | 'onComplete'> & {
  protectTxButton?(): JSX.Element;
};

const SignTransaction: FC<Props> = ({ txConfig, onComplete, protectTxButton }: Props) => {
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
      {protectTxButton && protectTxButton()}
    </>
  );
};

export default SignTransaction;
