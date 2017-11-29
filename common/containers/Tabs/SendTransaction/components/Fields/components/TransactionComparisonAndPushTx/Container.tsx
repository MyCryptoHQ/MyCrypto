import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { getSignedTx, getWeb3Tx } from 'selectors/transaction';
interface StateProps {
  serializedTransaction: Buffer | null;
}
interface Props {
  isWeb3: boolean;
  withSerializedTransaction(
    serializedTransaction: string
  ): React.ReactElement<any> | null;
}
class Container extends Component<StateProps & Props, {}> {
  public render() {
    const { serializedTransaction, withSerializedTransaction } = this.props;
    return serializedTransaction
      ? withSerializedTransaction(serializedTransaction.toString('hex'))
      : null;
  }
}

export const SignedTransaction = connect(
  (state: AppState, ownProps: Props) => ({
    serializedTransaction: ownProps.isWeb3
      ? getWeb3Tx(state)
      : getSignedTx(state)
  })
)(Container);
