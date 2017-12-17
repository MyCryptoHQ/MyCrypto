import {
  FieldAction,
  TypeKeys as TK,
  SwapTokenToEtherAction,
  SwapEtherToTokenAction,
  SwapTokenToTokenAction
} from 'actions/transaction';
import { createReducerFromObj } from '../helpers';
import { ReducersMapObject, Reducer } from 'redux';
import { State } from './typings';
import { gasPricetoBase } from 'libs/units';

const INITIAL_STATE: State = {
  to: { raw: '', value: null },
  data: { raw: '', value: null },
  nonce: { raw: '', value: null },
  value: { raw: '', value: null },
  gasLimit: { raw: '', value: null },
  gasPrice: { raw: '21', value: gasPricetoBase(21) }
};

const updateField = (key: keyof State): Reducer<State> => (state: State, action: FieldAction) => ({
  ...state,
  [key]: { ...state[key], ...action.payload }
});

const reducerObj: ReducersMapObject = {
  [TK.TO_FIELD_SET]: updateField('to'),
  [TK.VALUE_FIELD_SET]: updateField('value'),
  [TK.DATA_FIELD_SET]: updateField('data'),
  [TK.GAS_LIMIT_FIELD_SET]: updateField('gasLimit'),
  [TK.NONCE_FIELD_SET]: updateField('nonce'),
  [TK.GAS_PRICE_FIELD_SET]: updateField('gasPrice'),
  [TK.TOKEN_TO_ETHER_SWAP]: (
    state: State,
    { payload: { decimal: _, ...rest } }: SwapTokenToEtherAction
  ): State => ({
    ...state,
    ...rest,
    data: INITIAL_STATE.data
  }),

  [TK.ETHER_TO_TOKEN_SWAP]: (
    state: State,
    { payload: { decimal: _, tokenTo: __, tokenValue: ___, ...rest } }: SwapEtherToTokenAction
  ): State => ({
    ...state,
    ...rest,
    value: INITIAL_STATE.value
  }),

  [TK.TOKEN_TO_TOKEN_SWAP]: (
    state: State,
    { payload: { decimal: _, tokenValue: __, ...rest } }: SwapTokenToTokenAction
  ): State => ({ ...state, ...rest }),
  // reset everything but gas price
  [TK.RESET]: (state: State): State => ({ ...INITIAL_STATE, gasPrice: state.gasPrice })
};

export const fields = createReducerFromObj(reducerObj, INITIAL_STATE);
