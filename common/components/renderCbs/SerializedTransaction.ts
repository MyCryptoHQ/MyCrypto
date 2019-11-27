import React, { Component } from 'react';

import { makeTransaction, IHexStrTransaction } from 'libs/transaction';
import { getTransactionFields } from 'libs/transaction/utils/ether';

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

export const SerializedTransaction = SerializedTransactionClass;
