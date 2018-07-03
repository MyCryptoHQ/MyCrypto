import { Reducer } from 'redux';
import BN from 'bn.js';

import { gasPriceToBase } from 'libs/units';
import * as transactionTypes from '../types';
import * as types from './types';

export const FIELDS_INITIAL_STATE: types.TransactionFieldsState = {
  to: { raw: '', value: null },
  data: { raw: '', value: null },
  nonce: { raw: '', value: null },
  value: { raw: '', value: null },
  gasLimit: { raw: '21000', value: new BN(21000) },
  gasPrice: { raw: '20', value: gasPriceToBase(20) }
};

const updateField = (
  key: keyof types.TransactionFieldsState
): Reducer<types.TransactionFieldsState> => (
  state: types.TransactionFieldsState,
  action: types.TransactionFieldAction
) => ({
  ...state,
  [key]: { ...state[key], ...action.payload }
});

const tokenToEther = (
  state: types.TransactionFieldsState,
  { payload: { decimal: _, ...rest } }: transactionTypes.SwapTokenToEtherAction
): types.TransactionFieldsState => ({
  ...state,
  ...rest,
  data: FIELDS_INITIAL_STATE.data
});

const etherToToken = (
  state: types.TransactionFieldsState,
  {
    payload: { decimal: _, tokenTo: __, tokenValue: ___, ...rest }
  }: transactionTypes.SwapEtherToTokenAction
): types.TransactionFieldsState => ({
  ...state,
  ...rest,
  value: FIELDS_INITIAL_STATE.value
});

const tokenToToken = (
  state: types.TransactionFieldsState,
  { payload: { decimal: _, tokenValue: __, ...rest } }: transactionTypes.SwapTokenToTokenAction
): types.TransactionFieldsState => ({ ...state, ...rest });

const reset = (
  state: types.TransactionFieldsState,
  { payload: { isContractInteraction } }: transactionTypes.ResetTransactionSuccessfulAction
): types.TransactionFieldsState => ({
  ...FIELDS_INITIAL_STATE,
  ...(isContractInteraction ? { to: state.to } : {})
});

export function fieldsReducer(
  state: types.TransactionFieldsState = FIELDS_INITIAL_STATE,
  action:
    | types.TransactionFieldAction
    | transactionTypes.SwapAction
    | transactionTypes.ResetTransactionSuccessfulAction
) {
  switch (action.type) {
    case types.TransactionFieldsActions.TO_FIELD_SET:
      return updateField('to')(state, action);
    case types.TransactionFieldsActions.VALUE_FIELD_SET:
      return updateField('value')(state, action);
    case types.TransactionFieldsActions.DATA_FIELD_SET:
      return updateField('data')(state, action);
    case types.TransactionFieldsActions.GAS_LIMIT_FIELD_SET:
      return updateField('gasLimit')(state, action);
    case types.TransactionFieldsActions.NONCE_FIELD_SET:
      return updateField('nonce')(state, action);
    case types.TransactionFieldsActions.GAS_PRICE_FIELD_SET:
      return updateField('gasPrice')(state, action);
    case transactionTypes.TransactionActions.TOKEN_TO_ETHER_SWAP:
      return tokenToEther(state, action);
    case transactionTypes.TransactionActions.ETHER_TO_TOKEN_SWAP:
      return etherToToken(state, action);
    case transactionTypes.TransactionActions.TOKEN_TO_TOKEN_SWAP:
      return tokenToToken(state, action);
    case transactionTypes.TransactionActions.RESET_SUCCESSFUL:
      return reset(state, action);
    default:
      return state;
  }
}
