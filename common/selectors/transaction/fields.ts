import { AppState } from 'reducers';
export { getData, getFields, getGasLimit, getValue, getTo, getNonce, getGasPrice };

const getFields = (state: AppState) => state.transaction.fields;
const getTo = (state: AppState) => getFields(state).to;
const getData = (state: AppState) => getFields(state).data;
const getGasLimit = (state: AppState) => getFields(state).gasLimit;
const getGasPrice = (state: AppState) => getFields(state).gasPrice;
const getValue = (state: AppState) => getFields(state).value;
const getNonce = (state: AppState) => getFields(state).nonce;
