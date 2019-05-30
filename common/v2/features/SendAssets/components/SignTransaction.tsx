import React, { Component } from 'react';
import { DeepPartial } from 'shared/types/util';
import { ISendState, ITxFields } from '../types';
import {
  SignTransactionPrivateKey,
  SignTransactionMetaMask,
  SignTransactionLedger,
  SignTransactionTrezor,
  SignTransactionSafeT
} from './SignTransactionWallets';
import { WalletName } from 'v2/types/global';
import './SignTransaction.scss';

type WalletType = WalletName;

interface Props {
  stateValues: ISendState;
  transactionFields: ITxFields;
  onNext(): void;
  onSubmit(transactionFields: ITxFields): void;
  updateState(state: DeepPartial<ISendState>): void;
}

export default class SignTransaction extends Component<Props> {
  public render() {
    const { stateValues, transactionFields } = this.props;
    const currentWalletType: WalletType | undefined = transactionFields.accountType;

    switch (currentWalletType) {
      case 'privateKey':
        return <SignTransactionPrivateKey />;
      case 'web3':
        return (
          <SignTransactionMetaMask
            stateValues={stateValues}
            transactionFields={transactionFields}
          />
        );
      case 'ledgerNanoS':
        return <SignTransactionLedger />;
      case 'trezor':
        return <SignTransactionTrezor />;
      case 'safeTmini':
        return <SignTransactionSafeT />;
      default:
        return null;
    }
  }
}
