import { State } from 'reducers/transaction/meta/typings';
import { getDecimalFromEtherUnit } from 'libs/units';
import {
  TypeKeys as TK,
  MetaAction,
  SetUnitMetaAction,
  SwapTokenToEtherAction,
  SwapEtherToTokenAction,
  SwapTokenToTokenAction
} from 'actions/transaction';
import { ReducersMapObject, Reducer } from 'redux';
import { createReducerFromObj } from 'reducers/transaction/helpers';

const INITIAL_STATE: State = {
  unit: 'ether',
  previousUnit: 'ether',
  decimal: getDecimalFromEtherUnit('ether'),
  tokenValue: { raw: '', value: null },
  tokenTo: { raw: '', value: null },
  from: null
};

//TODO: generic-ize updateField to reuse
const updateField = (key: keyof State): Reducer<State> => (state: State, action: MetaAction) => {
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

const reducerObj: ReducersMapObject = {
  [TK.UNIT_META_SET]: (state: State, { payload }: SetUnitMetaAction): State => ({
    ...state,
    previousUnit: state.unit,
    unit: payload
  }),
  [TK.TOKEN_VALUE_META_SET]: updateField('tokenValue'),
  [TK.TOKEN_TO_META_SET]: updateField('tokenTo'),
  [TK.GET_FROM_SUCCEEDED]: updateField('from'),

  [TK.TOKEN_TO_ETHER_SWAP]: (state: State, { payload }: SwapTokenToEtherAction): State => {
    const { tokenValue, tokenTo } = INITIAL_STATE;
    return { ...state, tokenTo, tokenValue, decimal: payload.decimal };
  },

  [TK.ETHER_TO_TOKEN_SWAP]: (
    state: State,
    { payload: { data: _, to: __, ...rest } }: SwapEtherToTokenAction
  ): State => ({ ...state, ...rest }),

  [TK.TOKEN_TO_TOKEN_SWAP]: (
    state: State,
    { payload: { data: _, to: __, ...rest } }: SwapTokenToTokenAction
  ): State => ({ ...state, ...rest }),

  [TK.RESET]: _ => INITIAL_STATE
};

export const meta = createReducerFromObj(reducerObj, INITIAL_STATE);
