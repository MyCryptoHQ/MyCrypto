import { Wei } from 'libs/units';
import { gasPriceValidator, gasLimitValidator } from 'libs/validators';
import { AppState } from 'features/reducers';
import { getTransactionStatus } from './broadcast/selectors';
import { getTo, getGasPrice, getGasLimit, getData } from './fields/selectors';
import { getMetaState } from './meta/selectors';
import { getSignState } from './sign/selectors';

export const getTransactionState = (state: AppState) => state.transaction;

export const getCurrentTransactionStatus = (state: AppState) => {
  const { indexingHash } = getSignState(state);
  if (!indexingHash) {
    return false;
  }
  const txExists = getTransactionStatus(state, indexingHash);
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
  gasPriceValidator(getGasPrice(state).raw);

export const isValidGasLimit = (state: AppState): boolean =>
  gasLimitValidator(getGasLimit(state).raw);

export const getDataExists = (state: AppState) => {
  const { value } = getData(state);
  return !!value && value.length > 0;
};

export const getToRaw = (state: AppState) => getTo(state).raw;

export const getPreviousUnit = (state: AppState) => getMetaState(state).previousUnit;

export const getGasCost = (state: AppState) => {
  const gasPrice = getGasPrice(state);
  const gasLimit = getGasLimit(state);
  return gasLimit.value ? gasPrice.value.mul(gasLimit.value) : Wei('0');
};
