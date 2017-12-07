import { AppState } from 'reducers';
import { getCurrentTo, getCurrentValue } from './current';
import { getFields } from './fields';
import { makeTransaction } from 'libs/transaction';
import EthTx from 'ethereumjs-tx';
import { getUnit } from 'selectors/transaction/meta';
import { reduceToValues, isFullTx } from 'selectors/transaction/helpers';

export { getTransaction, getTransactionState };

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
  const transaction: EthTx = makeTransaction(reduceToValues(transactionFields));
  const isFullTransaction = isFullTx(transactionFields, currentTo, currentValue, unit);

  return { transaction, isFullTransaction };
};
