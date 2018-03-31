import { AppState } from 'reducers';
import { ICurrentTo, ICurrentValue } from 'selectors/transaction';
import { isNetworkUnit } from 'selectors/config';

type TransactionFields = AppState['transaction']['fields'];

export type TransactionFieldValues = {
  [field in keyof TransactionFields]: TransactionFields[field]['value']
};

export const reduceToValues = (transactionFields: AppState['transaction']['fields']) =>
  Object.keys(transactionFields).reduce<TransactionFieldValues>(
    (obj, currFieldName: keyof TransactionFields) => {
      const currField = transactionFields[currFieldName];
      return { ...obj, [currFieldName]: currField.value };
    },
    {} as TransactionFieldValues
  );

export const isFullTx = (
  state: AppState,
  transactionFields: AppState['transaction']['fields'],
  currentTo: ICurrentTo,
  currentValue: ICurrentValue,
  dataExists: boolean,
  validGasCost: boolean,
  unit: string // if its ether, we can have empty data, if its a token, we cant have value
) => {
  const { data, value, to, ...rest } = transactionFields;
  const partialParamsToCheck = { ...rest };

  delete partialParamsToCheck.windowStart;
  delete partialParamsToCheck.windowSize;
  delete partialParamsToCheck.scheduleTimestamp;
  delete partialParamsToCheck.schedulingToggle;
  delete partialParamsToCheck.scheduleDeposit;
  delete partialParamsToCheck.scheduleGasLimit;
  delete partialParamsToCheck.scheduleGasPrice;

  const validPartialParams = Object.values(partialParamsToCheck).reduce<boolean>(
    (isValid, v: AppState['transaction']['fields'] & ICurrentTo & ICurrentValue) =>
      isValid && !!v.value,
    true
  );

  if (isNetworkUnit(state, unit)) {
    // if theres data we can have no current value, and we dont have to check for a to address
    if (dataExists && validGasCost && !currentValue.value && currentValue.raw === '') {
      return validPartialParams;
    } else if (dataExists && validGasCost && !to.value && to.raw === '') {
      // same goes for value transactions to 0x
      return !!(validPartialParams && currentValue.value);
    } else {
      // otherwise we require value
      return !!(validPartialParams && currentValue.value && to.value && currentTo.value);
    }
  } else {
    return !!(
      validPartialParams &&
      data.value &&
      !value.value &&
      currentValue.value &&
      to.value &&
      currentTo.value
    );
  }
};

export const isWindowSizeValid = (transactionFields: AppState['transaction']['fields']) => {
  const { windowSize } = transactionFields;

  return Boolean(windowSize && windowSize.value);
};

export const isWindowStartValid = (
  transactionFields: AppState['transaction']['fields'],
  latestBlock: string
) => {
  const { windowStart } = transactionFields;

  return Boolean(windowStart && windowStart.value && windowStart.value > parseInt(latestBlock, 10));
};

export const isScheduleTimestampValid = (transactionFields: AppState['transaction']['fields']) => {
  const { scheduleTimestamp } = transactionFields;
  const now = new Date();

  return Boolean(scheduleTimestamp && scheduleTimestamp.value && scheduleTimestamp.value > now);
};
