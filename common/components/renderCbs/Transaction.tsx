import EthTx from 'ethereumjs-tx';
import { GetTransactionFields } from './TransactionFields';
import { AppState } from 'reducers';
import React from 'react';

const reduceToValues = (transactionFields: AppState['transactionFields']) =>
  Object.keys(transactionFields).reduce(
    (obj, currFieldName) => {
      const currField: AppState['transactionFields'] =
        transactionFields[currFieldName];
      return { ...obj, [currFieldName]: currField.value };
    },
    {} as any //TODO: Fix types
  );

interface Props {
  withTransaction({
    transaction
  }: {
    transaction: EthTx;
  }): React.ReactElement<any> | null;
}
//TODO: only re-render when reduced values change
export const Transaction: React.SFC<Props> = ({ withTransaction }) => (
  <GetTransactionFields
    withFieldValues={values =>
      withTransaction({ transaction: new EthTx(reduceToValues(values)) })
    }
  />
);
