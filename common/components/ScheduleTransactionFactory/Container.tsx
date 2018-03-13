import { signTransactionRequested, TSignTransactionRequested } from 'actions/transaction';
import React, { Component } from 'react';
import { connect } from 'react-redux';

interface DispatchProps {
  signTransactionRequested: TSignTransactionRequested;
}

interface OwnProps {
  isWeb3: boolean;
  withSigner(signer: TSignTransactionRequested): React.ReactElement<any> | null;
}

class Container extends Component<DispatchProps & OwnProps, {}> {
  public render() {
    return this.props.withSigner(this.props.signTransactionRequested);
  }
}

export const WithSigner = connect(null, { signTransactionRequested })(Container);
