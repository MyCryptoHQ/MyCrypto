import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { getSerializedTransaction } from 'selectors/transaction';

interface StateProps {
  serializedTransaction: Buffer | null;
}
interface Props {
  withSerializedTransaction(serializedTransaction: string): React.ReactElement<any> | null;
}
class SerializedTransactionClass extends Component<StateProps & Props, {}> {
  public render() {
    const { serializedTransaction, withSerializedTransaction } = this.props;
    return serializedTransaction
      ? withSerializedTransaction(serializedTransaction.toString('hex'))
      : null;
  }
}

export const SerializedTransaction = connect((state: AppState) => ({
  serializedTransaction: getSerializedTransaction(state)
}))(SerializedTransactionClass);
