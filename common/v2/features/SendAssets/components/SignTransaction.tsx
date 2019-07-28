import React from 'react';

import { TWalletType } from 'v2/types';
import { IStepComponentProps, ITxObject, ITxReceipt } from '../types';
import { fromStateToTxObject } from '../helpers';
import {
  SignTransactionKeystore,
  SignTransactionLedger,
  SignTransactionMetaMask,
  SignTransactionPrivateKey,
  SignTransactionSafeT,
  SignTransactionTrezor
} from './SignTransactionWallets';
import './SignTransaction.scss';

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
    senderAccount: { wallet: walletName }
  } = txConfig;
  const txObject: ITxObject = fromStateToTxObject(txConfig);

  const getWalletComponent = (walletType: TWalletType) => {
    switch (walletType) {
      case 'privateKey':
        return SignTransactionPrivateKey;
      case 'web3':
        return SignTransactionMetaMask;
      case 'ledgerNanoS':
        return SignTransactionLedger;
      case 'trezor':
        return SignTransactionTrezor;
      case 'safeTmini':
        return SignTransactionSafeT;
      case 'keystoreFile':
        return SignTransactionKeystore;
      default:
        return null;
    }
  };

  const WalletComponent = getWalletComponent(walletName);

  return (
    <WalletComponent
      rawTransaction={txObject}
      onSuccess={(receipt: ITxReceipt) => onComplete(receipt)}
    />
  );
}
