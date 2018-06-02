import { AppState } from 'features/reducers';
import { getTransactionState } from '../selectors';

export const getMetaState = (state: AppState) => getTransactionState(state).meta;
export const getDecimal = (state: AppState) => getMetaState(state).decimal;
export const getTokenTo = (state: AppState) => getMetaState(state).tokenTo;
export const getTokenValue = (state: AppState) => getMetaState(state).tokenValue;
export const isContractInteraction = (state: AppState) => getMetaState(state).isContractInteraction;
