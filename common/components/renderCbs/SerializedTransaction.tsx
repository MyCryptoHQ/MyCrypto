import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { getSignedTx, getWeb3Tx } from 'selectors/transaction';
import { Web3Wallet } from 'libs/wallet';
interface StateProps {
  serializedTransaction: Buffer | null;
}
interface Props {
  withSerializedTransaction(
    serializedTransaction: string
  ): React.ReactElement<any> | null;
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
  serializedTransaction:
    state.wallet.inst instanceof Web3Wallet
      ? getWeb3Tx(state)
      : getSignedTx(state)
}))(SerializedTransactionClass);
