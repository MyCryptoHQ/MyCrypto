import { Reducer } from 'redux';
import BN from 'bn.js';

import { Wei, gasPriceToBase } from 'libs/units';
import {
  TRANSACTION,
  SwapTokenToEtherAction,
  SwapEtherToTokenAction,
  SwapTokenToTokenAction,
  SwapAction,
  ResetTransactionSuccessfulAction
} from '../types';
import {
  TRANSACTION_FIELDS,
  FieldAction,
  SetToFieldAction,
  SetDataFieldAction,
  SetNonceFieldAction,
  SetGasLimitFieldAction
} from './types';

export interface FieldsState {
  to: SetToFieldAction['payload'];
  data: SetDataFieldAction['payload'];
  nonce: SetNonceFieldAction['payload'];
  value: { raw: string; value: Wei | null }; // TODO: fix this workaround since some of the payload is optional
  gasLimit: SetGasLimitFieldAction['payload'];
  gasPrice: { raw: string; value: Wei };
}

export const FIELDS_INITIAL_STATE: FieldsState = {
  to: { raw: '', value: null },
  data: { raw: '', value: null },
  nonce: { raw: '', value: null },
  value: { raw: '', value: null },
  gasLimit: { raw: '21000', value: new BN(21000) },
  gasPrice: { raw: '20', value: gasPriceToBase(20) }
};

const updateField = (key: keyof FieldsState): Reducer<FieldsState> => (
  state: FieldsState,
  action: FieldAction
) => ({
  ...state,
  [key]: { ...state[key], ...action.payload }
});

const tokenToEther = (
  state: FieldsState,
  { payload: { decimal: _, ...rest } }: SwapTokenToEtherAction
): FieldsState => ({
  ...state,
  ...rest,
  data: FIELDS_INITIAL_STATE.data
});

const etherToToken = (
  state: FieldsState,
  { payload: { decimal: _, tokenTo: __, tokenValue: ___, ...rest } }: SwapEtherToTokenAction
): FieldsState => ({
  ...state,
  ...rest,
  value: FIELDS_INITIAL_STATE.value
});

const tokenToToken = (
  state: FieldsState,
  { payload: { decimal: _, tokenValue: __, ...rest } }: SwapTokenToTokenAction
): FieldsState => ({ ...state, ...rest });

const reset = (
  state: FieldsState,
  { payload: { isContractInteraction } }: ResetTransactionSuccessfulAction
): FieldsState => ({
  ...FIELDS_INITIAL_STATE,
  ...(isContractInteraction ? { to: state.to } : {})
});

export default function fields(
  state: FieldsState = FIELDS_INITIAL_STATE,
  action: FieldAction | SwapAction | ResetTransactionSuccessfulAction
) {
  switch (action.type) {
    case TRANSACTION_FIELDS.TO_FIELD_SET:
      return updateField('to')(state, action);
    case TRANSACTION_FIELDS.VALUE_FIELD_SET:
      return updateField('value')(state, action);
    case TRANSACTION_FIELDS.DATA_FIELD_SET:
      return updateField('data')(state, action);
    case TRANSACTION_FIELDS.GAS_LIMIT_FIELD_SET:
      return updateField('gasLimit')(state, action);
    case TRANSACTION_FIELDS.NONCE_FIELD_SET:
      return updateField('nonce')(state, action);
    case TRANSACTION_FIELDS.GAS_PRICE_FIELD_SET:
      return updateField('gasPrice')(state, action);
    case TRANSACTION.TOKEN_TO_ETHER_SWAP:
      return tokenToEther(state, action);
    case TRANSACTION.ETHER_TO_TOKEN_SWAP:
      return etherToToken(state, action);
    case TRANSACTION.TOKEN_TO_TOKEN_SWAP:
      return tokenToToken(state, action);
    case TRANSACTION.RESET_SUCCESSFUL:
      return reset(state, action);
    default:
      return state;
  }
}
