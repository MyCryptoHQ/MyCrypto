import React, { Component } from 'react';
import { connect } from 'react-redux';

import { makeTransaction, IHexStrTransaction } from 'libs/transaction';
import { getTransactionFields } from 'libs/transaction/utils/ether';
import { AppState } from 'features/reducers';
import * as selectors from 'features/selectors';

interface StateProps {
  serializedTransaction: Buffer | null;
}

interface Props {
  withSerializedTransaction(
    serializedTransaction: string,
    transactionFields: IHexStrTransaction
  ): React.ReactElement<any> | null;
}

class SerializedTransactionClass extends Component<StateProps & Props, {}> {
  public render() {
    const { serializedTransaction, withSerializedTransaction } = this.props;
    return serializedTransaction
      ? withSerializedTransaction(
          serializedTransaction.toString('hex'),
          getRawTxFields(serializedTransaction.toString('hex'))
        )
      : null;
  }
}

const getRawTxFields = (serializedTransaction: string) =>
  getTransactionFields(makeTransaction(serializedTransaction));

export const SerializedTransaction = connect((state: AppState) => ({
  serializedTransaction: selectors.getSerializedTransaction(state)
}))(SerializedTransactionClass);
