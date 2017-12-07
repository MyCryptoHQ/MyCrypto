import { AppState } from 'reducers';
import { ICurrentTo, ICurrentValue } from 'selectors/transaction';
import { isEtherUnit } from 'libs/units';

export const reduceToValues = (transactionFields: AppState['transaction']['fields']) =>
  Object.keys(transactionFields).reduce(
    (obj, currFieldName) => {
      const currField: AppState['transaction']['fields'] = transactionFields[currFieldName];
      return { ...obj, [currFieldName]: currField.value };
    },
    {} as any //TODO: Fix types
  );

export const isFullTx = (
  transactionFields: AppState['transaction']['fields'],
  currentTo: ICurrentTo,
  currentValue: ICurrentValue,
  unit: string // if its ether, we can have empty data, if its a token, we cant have value
) => {
  const { data, value, ...rest } = transactionFields;

  const partialParamsToCheck = { ...rest, currentValue, currentTo };
  const validPartialParams = Object.values(partialParamsToCheck).reduce<boolean>(
    (isValid, v: AppState['transaction']['fields'] & ICurrentTo & ICurrentValue) =>
      isValid && !!v.value,
    true
  );

  return isEtherUnit(unit)
    ? validPartialParams
    : validPartialParams && !!data.value && !value.value;
};
