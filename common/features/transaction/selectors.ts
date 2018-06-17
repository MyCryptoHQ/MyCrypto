import { Wei } from 'libs/units';
import { gasPriceValidator, gasLimitValidator } from 'libs/validators';
import { AppState } from 'features/reducers';
import * as transactionBroadcastSelectors from './broadcast/selectors';
import * as transactionFieldsSelectors from './fields/selectors';
import * as transactionMetaSelectors from './meta/selectors';
import * as transactionSignSelectors from './sign/selectors';

export const getTransactionState = (state: AppState) => state.transaction;

export const getCurrentTransactionStatus = (state: AppState) => {
  const { indexingHash } = transactionSignSelectors.getSignState(state);
  if (!indexingHash) {
    return false;
  }
  const txExists = transactionBroadcastSelectors.getTransactionStatus(state, indexingHash);
  return txExists;
};

export const currentTransactionFailed = (state: AppState) => {
  const txExists = getCurrentTransactionStatus(state);
  return txExists && !txExists.broadcastSuccessful;
};

// Note: if the transaction or the indexing hash doesn't exist, we have a problem
export const currentTransactionBroadcasting = (state: AppState) => {
  const txExists = getCurrentTransactionStatus(state);

  return txExists && txExists.isBroadcasting;
};

export const currentTransactionBroadcasted = (state: AppState) => {
  const txExists = getCurrentTransactionStatus(state);

  return txExists && !txExists.isBroadcasting;
};

export const isValidGasPrice = (state: AppState): boolean =>
  gasPriceValidator(transactionFieldsSelectors.getGasPrice(state).raw);

export const isValidGasLimit = (state: AppState): boolean =>
  gasLimitValidator(transactionFieldsSelectors.getGasLimit(state).raw);

export const getDataExists = (state: AppState) => {
  const { value } = transactionFieldsSelectors.getData(state);
  return !!value && value.length > 0;
};

export const getToRaw = (state: AppState) => transactionFieldsSelectors.getTo(state).raw;

export const getPreviousUnit = (state: AppState) =>
  transactionMetaSelectors.getMetaState(state).previousUnit;

export const getGasCost = (state: AppState) => {
  const gasPrice = transactionFieldsSelectors.getGasPrice(state);
  const gasLimit = transactionFieldsSelectors.getGasLimit(state);
  return gasLimit.value ? gasPrice.value.mul(gasLimit.value) : Wei('0');
};
