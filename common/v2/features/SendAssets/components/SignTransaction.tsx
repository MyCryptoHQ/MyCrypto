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
  // @TODO remove before deployement.
  // const txObject = {
  //   nonce: 0,
  //   gasLimit: 21000,
  //   gasPrice: utils.bigNumberify('20000000000'),
  //   to: '0x88a5C2d9919e46F883EB62F7b8Dd9d0CC45bc290',
  //   // ... or supports ENS names
  //   value: utils.parseEther('0.00001'),
  //   data: '0x',
  //   // This ensures the transaction cannot be replayed on different networks
  //   chainId: ethers.utils.getNetwork(DEFAULT_NETWORK_FOR_FALLBACK).chainId
  // };

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
