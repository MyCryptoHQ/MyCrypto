import React, { Component } from 'react';
import { DeepPartial } from 'shared/types/util';
import { WalletName } from 'v2/config/data';
import { ISendState, ITxFields } from '../types';
import './SignTransaction.scss';
import {
  SignTransactionLedger,
  SignTransactionMetaMask,
  SignTransactionPrivateKey,
  SignTransactionSafeT,
  SignTransactionTrezor
} from './SignTransactionWallets';

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
    const { stateValues, transactionFields, onNext, updateState } = this.props;
    const currentWalletType: WalletType = transactionFields.account.wallet;

    switch (currentWalletType) {
      case 'privateKey':
        return <SignTransactionPrivateKey />;
      case 'web3':
        return (
          <SignTransactionMetaMask
            stateValues={stateValues}
            transactionFields={transactionFields}
            onNext={receipt => {
              const nextState: DeepPartial<ISendState> = {
                transactionFields: { account: { transactions: [{ txHash: receipt.hash }] } }
              };
              updateState(nextState);
              onNext();
            }}
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
