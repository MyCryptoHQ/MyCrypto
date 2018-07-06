import { AppState } from 'features/reducers';

const getTransactionState = (state: AppState) => state.transaction;

export const getFields = (state: AppState) => getTransactionState(state).fields;
export const getTo = (state: AppState) => getFields(state).to;
export const getData = (state: AppState) => getFields(state).data;
export const getGasLimit = (state: AppState) => getFields(state).gasLimit;
export const getGasPrice = (state: AppState) => getFields(state).gasPrice;
export const getValue = (state: AppState) => getFields(state).value;
export const getNonce = (state: AppState) => getFields(state).nonce;
