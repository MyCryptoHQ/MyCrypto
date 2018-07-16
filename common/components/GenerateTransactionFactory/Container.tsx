import React, { Component } from 'react';
import { connect } from 'react-redux';

import { transactionSignActions } from 'features/transaction';

interface DispatchProps {
  signTransactionRequested: transactionSignActions.TSignTransactionRequested;
}

interface OwnProps {
  isWeb3: boolean;
  withSigner(
    signer: transactionSignActions.TSignTransactionRequested
  ): React.ReactElement<any> | null;
}

class Container extends Component<DispatchProps & OwnProps, {}> {
  public render() {
    return this.props.withSigner(this.props.signTransactionRequested);
  }
}

export const WithSigner = connect(null, {
  signTransactionRequested: transactionSignActions.signTransactionRequested
})(Container);
