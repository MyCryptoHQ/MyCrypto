import { AppState } from 'reducers';
import { getCurrentTo, getCurrentValue, isEtherTransaction } from './current';
import { getFields } from './fields';
import { makeTransaction, enoughBalanceViaTx, enoughTokensViaTx } from 'libs/transaction';
import EthTx from 'ethereumjs-tx';
import { getUnit } from 'selectors/transaction/meta';
import { reduceToValues, isFullTx } from 'selectors/transaction/helpers';
import { getOffline } from 'selectors/config';
import { getTokenBalance, getEtherBalance } from 'selectors/wallet';
export { getTransaction, getTransactionState, userHasEnoughBalance };

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

const userHasEnoughBalance = (state: AppState): boolean => {
  const { transaction } = getTransaction(state);
  const etherTransaction = isEtherTransaction(state);
  const isOffline = getOffline(state);
  const etherBalance = getEtherBalance(state);

  // if we're offline we cant fetch the balance state anyway
  if (isOffline || !etherBalance) {
    return true;
  }

  // check that they have enough ether
  let valid = true;

  valid = valid && enoughBalanceViaTx(transaction, etherBalance);

  if (!etherTransaction) {
    const unit = getUnit(state);
    const tokenBalance = getTokenBalance(state, unit);
    valid = valid && enoughTokensViaTx(transaction, tokenBalance);
  }

  return valid;
};
