import { AppState } from 'reducers';
import { getTransactionState } from 'selectors/transaction';
export { getData, getFields, getGasLimit, getValue, getTo, getNonce, getGasPrice, dataExists };

const getFields = (state: AppState) => getTransactionState(state).fields;
const getTo = (state: AppState) => getFields(state).to;
const getData = (state: AppState) => getFields(state).data;
const getGasLimit = (state: AppState) => getFields(state).gasLimit;
const getGasPrice = (state: AppState) => getFields(state).gasPrice;
const getValue = (state: AppState) => getFields(state).value;
const getNonce = (state: AppState) => getFields(state).nonce;
const dataExists = (state: AppState) => {
  const { value } = getData(state);
  return !!value && value.length > 0;
};
