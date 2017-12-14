import { AppState } from 'reducers';
import { getCurrentTo, getCurrentValue } from './current';
import { getFields } from './fields';
import { makeTransaction } from 'libs/transaction';
import EthTx from 'ethereumjs-tx';
import { getUnit } from 'selectors/transaction/meta';
import { reduceToValues, isFullTx } from 'selectors/transaction/helpers';
import { getGasPrice, getGasLimit, getDataExists } from 'selectors/transaction';
import { Wei } from 'libs/units';
export { getTransaction, getTransactionState, getGasCost, nonValueTransaction };

const getTransactionState = (state: AppState) => state.transaction;

export interface IGetTransaction {
  transaction: EthTx;
  isFullTransaction: boolean; //if the user has filled all the fields
}

const getTransaction = (state: AppState): IGetTransaction => {
  const currentTo = getCurrentTo(state);
  const currentValue = getCurrentValue(state);
  const transactionFields = getFields(state);
  const unit = getUnit(state);
  const reducedValues = reduceToValues(transactionFields);
  const transaction: EthTx = makeTransaction(reducedValues);
  const isFullTransaction = isFullTx(transactionFields, currentTo, currentValue, unit);

  return { transaction, isFullTransaction };
};

const nonValueTransaction = (state: AppState): boolean => {
  const currentValue = getCurrentValue(state);
  const { isFullTransaction } = getTransaction(state);
  const dataExists = getDataExists(state);
  return isFullTransaction && dataExists && !currentValue.value;
};

const getGasCost = (state: AppState) => {
  const gasPrice = getGasPrice(state);
  const gasLimit = getGasLimit(state);
  if (!gasLimit.value) {
    return Wei('0');
  }
  const cost = gasLimit.value.mul(gasPrice.value);

  return cost;
};
