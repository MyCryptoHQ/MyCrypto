import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';

interface StateProps {
  signedTransaction: string;
}
interface Props {
  withSignedTransaction({
    signedTransaction
  }: {
    signedTransaction: string;
  }): React.ReactElement<any> | null;
}
class Container extends Component<StateProps & Props, {}> {
  public render() {
    const { signedTransaction, withSignedTransaction } = this.props;
    return signedTransaction
      ? withSignedTransaction({ signedTransaction })
      : null;
  }
}

export const SignedTransaction = connect((state: AppState) => ({
  signedTransaction: state.transaction.signing.signedTransaction
}))(Container);
