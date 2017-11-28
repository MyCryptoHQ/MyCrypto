import {
  signTransactionRequested,
  TSignTransactionRequested,
  SignTransactionRequestedAction
} from 'actions/transaction';
import React, { Component } from 'react';
import { connect } from 'react-redux';

type Payload = SignTransactionRequestedAction['payload'];
type Signer = (payload: Payload) => () => SignTransactionRequestedAction;

interface DispatchProps {
  signTransaction: TSignTransactionRequested;
}
interface Props {
  withSigner(signer: Signer): React.ReactElement<any> | null;
}

class Container extends Component<DispatchProps & Props, {}> {
  public render() {
    return this.props.withSigner(this.sign);
  }

  private sign = (payload: Payload) => () =>
    this.props.signTransaction(payload);
}

export const WithSigner = connect(null, {
  signTransaction: signTransactionRequested
})(Container);
