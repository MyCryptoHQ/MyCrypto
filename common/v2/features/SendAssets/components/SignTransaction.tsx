import React, { Component } from 'react';
// import { SignTransactionLedger } from './SignTransactionWallets';
import { SendState } from '../SendAssets';
// import { SignTransactionTrezor } from './SignTransactionWallets';

interface Props {
  stateValues: SendState;
}

export default function createSignTransaction() {
  return (props: Pick<Props, 'stateValues'>) => {
    return <SignTransaction stateValues={props.stateValues} />;
  };
}

export class SignTransaction extends Component<Props> {
  public render() {
    return <div>This gets renders when signing Transaction</div>;
  }
}
