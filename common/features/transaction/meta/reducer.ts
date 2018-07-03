import { Reducer } from 'redux';

import { getDecimalFromEtherUnit } from 'libs/units';
import { transactionNetworkTypes } from '../network';
import * as transactionTypes from '../types';
import * as types from './types';

export const META_INITIAL_STATE: types.TransactionMetaState = {
  unit: '',
  previousUnit: '',
  decimal: getDecimalFromEtherUnit('ether'),
  tokenValue: { raw: '', value: null },
  tokenTo: { raw: '', value: null },
  from: null,
  isContractInteraction: false
};

//TODO: generic-ize updateField to reuse
const updateMetaField = (
  key: keyof types.TransactionMetaState
): Reducer<types.TransactionMetaState> => (
  state: types.TransactionMetaState,
  action: types.TransactionMetaAction
) => {
  if (typeof action.payload === 'object') {
    // we do this to update just 'raw' or 'value' param of tokenValue
    return {
      ...state,
      [key]: { ...(state[key] as object), ...action.payload }
    };
  } else {
    return {
      ...state,
      [key]: action.payload
    };
  }
};

const tokenToEtherMeta = (
  state: types.TransactionMetaState,
  { payload }: transactionTypes.SwapTokenToEtherAction
): types.TransactionMetaState => {
  const { tokenValue, tokenTo } = META_INITIAL_STATE;
  return { ...state, tokenTo, tokenValue, decimal: payload.decimal };
};

const etherToTokenMeta = (
  state: types.TransactionMetaState,
  { payload: { data: _, to: __, ...rest } }: transactionTypes.SwapEtherToTokenAction
): types.TransactionMetaState => ({ ...state, ...rest });

const tokenToTokenMeta = (
  state: types.TransactionMetaState,
  { payload: { data: _, to: __, ...rest } }: transactionTypes.SwapTokenToTokenAction
): types.TransactionMetaState => ({ ...state, ...rest });

const resetMeta = (state: types.TransactionMetaState): types.TransactionMetaState => ({
  ...META_INITIAL_STATE,
  isContractInteraction: state.isContractInteraction,
  unit: state.unit
});

const unitMeta = (
  state: types.TransactionMetaState,
  { payload }: types.SetUnitMetaAction
): types.TransactionMetaState => ({
  ...state,
  previousUnit: state.unit,
  unit: payload
});

export function metaReducer(
  state: types.TransactionMetaState = META_INITIAL_STATE,
  action:
    | types.MetaAction
    | transactionTypes.SwapAction
    | transactionTypes.ResetTransactionSuccessfulAction
    | transactionNetworkTypes.TransactionNetworkAction
): types.TransactionMetaState {
  switch (action.type) {
    case types.TransactionMetaActions.UNIT_META_SET:
      return unitMeta(state, action);
    case types.TransactionMetaActions.TOKEN_VALUE_META_SET:
      return updateMetaField('tokenValue')(state, action);
    case types.TransactionMetaActions.TOKEN_TO_META_SET:
      return updateMetaField('tokenTo')(state, action);
    case transactionNetworkTypes.TransactionNetworkActions.GET_FROM_SUCCEEDED:
      return updateMetaField('from')(state, action);
    case transactionTypes.TransactionActions.TOKEN_TO_ETHER_SWAP:
      return tokenToEtherMeta(state, action);
    case transactionTypes.TransactionActions.ETHER_TO_TOKEN_SWAP:
      return etherToTokenMeta(state, action);
    case transactionTypes.TransactionActions.TOKEN_TO_TOKEN_SWAP:
      return tokenToTokenMeta(state, action);
    case types.TransactionMetaActions.IS_VIEW_AND_SEND: {
      const nextState: types.TransactionMetaState = { ...state, isContractInteraction: false };
      return nextState;
    }
    case types.TransactionMetaActions.IS_CONTRACT_INTERACTION: {
      const nextState: types.TransactionMetaState = { ...state, isContractInteraction: true };
      return nextState;
    }
    case transactionTypes.TransactionActions.RESET_SUCCESSFUL:
      return resetMeta(state);
    default:
      return state;
  }
}
