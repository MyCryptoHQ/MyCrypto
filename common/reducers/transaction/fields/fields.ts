import { FieldAction, TypeKeys as TK } from 'actions/transaction';
import { createReducerFromObj } from '../helpers';
import { ReducersMapObject, Reducer } from 'redux';
import { State } from './typings';

const INITIAL_STATE: State = {
  to: { raw: '', value: null },
  data: { raw: '', value: null },
  nonce: { raw: '', value: null },
  value: { raw: '', value: null },
  gasLimit: { raw: '', value: null }
};

const updateField = (key: keyof State): Reducer<State> => (
  state: State,
  action: FieldAction
) => ({
  ...state,
  [key]: { ...state[key], ...action.payload }
});

const reducerObj: ReducersMapObject = {
  [TK.TO_FIELD_SET]: updateField('to'),
  [TK.VALUE_FIELD_SET]: updateField('value'),
  [TK.DATA_FIELD_SET]: updateField('data'),
  [TK.GAS_LIMIT_FIELD_SET]: updateField('gasLimit'),
  [TK.NONCE_FIELD_SET]: updateField('nonce'),
  [TK.RESET]: _ => INITIAL_STATE
};

export const fields = createReducerFromObj(reducerObj, INITIAL_STATE);
