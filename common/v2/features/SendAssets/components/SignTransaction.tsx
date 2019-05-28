import React, { Component } from 'react';
import { ISendState, ITxFields } from '../types';
import {
  SignTransactionPrivateKey,
  SignTransactionLedger,
  SignTransactionTrezor
} from './SignTransactionWallets';
import { DeepPartial } from 'shared/types/util';
import SignTransactionMetaMask from './SignTransactionWallets/Metamask';

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
    const whichWallet = transactionFields.accountType;

    switch (whichWallet) {
      case 'privateKey':
        return (
          <div>
            <SignTransactionPrivateKey />
          </div>
        );
      case 'web3':
        return (
          <div>
            <SignTransactionMetaMask
              stateValues={stateValues}
              transactionFields={transactionFields}
            />
          </div>
        );
      case 'ledgerNanoS':
        return (
          <div>
            <SignTransactionLedger />
          </div>
        );
      case 'trezor':
        return (
          <div>
            <SignTransactionTrezor />
          </div>
        );
      default:
        return null;
      // case 'Mnemonic':
      //   return <div>Mnemonic</div>;
    }
  }
}
