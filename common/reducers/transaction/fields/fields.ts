import { FieldAction, TypeKeys as TK } from 'actions/transaction';
import { createReducerFromObj } from '../helpers';
import { ReducersMapObject, Reducer } from 'redux';
import { State } from './typings';
import { TypeKeys as ConfigTK } from 'actions/config/constants';
import { toWei, getDecimal } from 'libs/units';
import { ChangeGasPriceAction } from 'actions/config';

const gasPricetoBase = (price: number) =>
  toWei(price.toString(), getDecimal('gwei'));
const INITIAL_STATE: State = {
  to: { raw: '', value: null },
  data: { raw: '', value: null },
  nonce: { raw: '', value: null },
  value: { raw: '', value: null },
  gasLimit: { raw: '', value: null },
  gasPrice: { raw: '', value: gasPricetoBase(21) }
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
  // this is kind of shoehorned in here, would need to re-work config reducer
  [ConfigTK.CONFIG_GAS_PRICE]: (
    state: State,
    { payload }: ChangeGasPriceAction
  ): State => ({
    ...state,
    gasPrice: { raw: '', value: gasPricetoBase(payload) }
  }),
  [TK.RESET]: _ => INITIAL_STATE
};

export const fields = createReducerFromObj(reducerObj, INITIAL_STATE);
