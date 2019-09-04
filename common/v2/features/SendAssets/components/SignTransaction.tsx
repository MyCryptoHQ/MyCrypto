import React from 'react';

import { TWalletType, ITxReceipt } from 'v2/types';
import { IStepComponentProps, ISignComponentProps, ISignedTx } from '../types';
import {
  SignTransactionKeystore,
  SignTransactionLedger,
  SignTransactionMetaMask,
  SignTransactionPrivateKey,
  SignTransactionSafeT,
  SignTransactionTrezor,
  SignTransactionMnemonic
} from './SignTransactionWallets';
import './SignTransaction.scss';

type SigningComponents = {
  readonly [k in Partial<TWalletType>]: React.ComponentType<ISignComponentProps> | null;
};
const SigningComponents: SigningComponents = {
  privateKey: SignTransactionPrivateKey,
  web3: SignTransactionMetaMask,
  ledgerNanoS: SignTransactionLedger,
  trezor: SignTransactionTrezor,
  safeTmini: SignTransactionSafeT,
  keystoreFile: SignTransactionKeystore,
  paritySigner: null,
  mnemonicPhrase: SignTransactionMnemonic,
  viewOnly: null
};

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

  const getWalletComponent = (walletType: TWalletType) => {
    return SigningComponents[walletType];
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
