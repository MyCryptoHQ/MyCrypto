import EthTx from 'ethereumjs-tx';
import { GetTransactionFields } from './TransactionFields';
import { GetTransactionMetaFields } from './MetaFields';
import { CurrentTo, ICurrentTo } from './CurrentTo';
import { CurrentValue, ICurrentValue } from './CurrentValue';
import { AppState } from 'reducers';
import React from 'react';

const reduceToValues = (transactionFields: AppState['transaction']['fields']) =>
  Object.keys(transactionFields).reduce(
    (obj, currFieldName) => {
      const currField: AppState['transaction']['fields'] =
        transactionFields[currFieldName];
      return { ...obj, [currFieldName]: currField.value };
    },
    {} as any //TODO: Fix types
  );

const isFullTx = (
  transactionFields: AppState['transaction']['fields'],
  currentTo: ICurrentTo,
  currentValue: ICurrentValue,
  unit: string // if its ether, we can have empty data, if its a token, we cant have value
) => {
  const { data, value, ...rest } = transactionFields;

  const partialParamsToCheck = { ...rest, currentValue, currentTo };
  const validPartialParams = Object.values(partialParamsToCheck).reduce<
    boolean
  >(
    (
      isValid,
      v: AppState['transaction']['fields'] & ICurrentTo & ICurrentValue
    ) => isValid && !!v.value,
    true
  );

  return unit === 'ether'
    ? validPartialParams
    : validPartialParams && !!data.value && !value.value;
};

interface ITransaction {
  transaction: EthTx;
  isFullTransaction: boolean; //if the user has filled all the fields
}

interface Props {
  withTransaction({
    transaction,
    isFullTransaction
  }: ITransaction): React.ReactElement<any> | null;
}
//TODO: only re-render when reduced values change
export const Transaction: React.SFC<Props> = ({ withTransaction }) => (
  <GetTransactionFields
    withFieldValues={values => (
      <GetTransactionMetaFields
        withFieldValues={({ unit }) => (
          <CurrentTo
            withCurrentTo={({ to }) => (
              <CurrentValue
                withValue={({ value }) =>
                  withTransaction({
                    transaction: new EthTx(reduceToValues(values)),
                    isFullTransaction: isFullTx(values, to, value, unit)
                  })
                }
              />
            )}
          />
        )}
      />
    )}
  />
);
