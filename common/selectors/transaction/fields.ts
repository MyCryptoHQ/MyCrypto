import { AppState } from 'reducers';
import { getTransactionState, getGasCost } from 'selectors/transaction';
import { getEtherBalance } from 'selectors/wallet';
import { getOffline } from 'selectors/config';

const getFields = (state: AppState) => getTransactionState(state).fields;
const getTo = (state: AppState) => getFields(state).to;
const getData = (state: AppState) => getFields(state).data;
const getGasLimit = (state: AppState) => getFields(state).gasLimit;
const getGasPrice = (state: AppState) => getFields(state).gasPrice;
const getValue = (state: AppState) => getFields(state).value;
const getNonce = (state: AppState) => getFields(state).nonce;
const getDataExists = (state: AppState) => {
  const { value } = getData(state);
  return !!value && value.length > 0;
};
const getValidGasCost = (state: AppState) => {
  const gasCost = getGasCost(state);
  const etherBalance = getEtherBalance(state);
  const isOffline = getOffline(state);
  if (isOffline || !etherBalance) {
    return true;
  }
  return gasCost.lte(etherBalance);
};

export {
  getData,
  getFields,
  getGasLimit,
  getValue,
  getTo,
  getNonce,
  getGasPrice,
  getDataExists,
  getValidGasCost
};
