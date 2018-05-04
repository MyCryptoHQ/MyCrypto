import { State } from 'reducers/transaction/meta/typings';
import { getDecimalFromEtherUnit } from 'libs/units';
import {
  TypeKeys as TK,
  MetaAction,
  SetUnitMetaAction,
  SwapTokenToEtherAction,
  SwapEtherToTokenAction,
  SwapTokenToTokenAction,
  SwapAction,
  ResetTransactionSuccessfulAction,
  NetworkAction,
  TransactionMetaAction
} from 'actions/transaction';
import { Reducer } from 'redux';

const INITIAL_STATE: State = {
  unit: '',
  previousUnit: '',
  decimal: getDecimalFromEtherUnit('ether'),
  tokenValue: { raw: '', value: null },
  tokenTo: { raw: '', value: null },
  from: null,
  isContractInteraction: false
};

//TODO: generic-ize updateField to reuse
const updateField = (key: keyof State): Reducer<State> => (
  state: State,
  action: TransactionMetaAction
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

const tokenToEther = (state: State, { payload }: SwapTokenToEtherAction): State => {
  const { tokenValue, tokenTo } = INITIAL_STATE;
  return { ...state, tokenTo, tokenValue, decimal: payload.decimal };
};

const etherToToken = (
  state: State,
  { payload: { data: _, to: __, ...rest } }: SwapEtherToTokenAction
): State => ({ ...state, ...rest });

const tokenToToken = (
  state: State,
  { payload: { data: _, to: __, ...rest } }: SwapTokenToTokenAction
): State => ({ ...state, ...rest });

const reset = (state: State): State => ({
  ...INITIAL_STATE,
  isContractInteraction: state.isContractInteraction,
  unit: state.unit
});

const unitMeta = (state: State, { payload }: SetUnitMetaAction): State => ({
  ...state,
  previousUnit: state.unit,
  unit: payload
});

export const meta = (
  state: State = INITIAL_STATE,
  action: MetaAction | SwapAction | ResetTransactionSuccessfulAction | NetworkAction
): State => {
  switch (action.type) {
    case TK.UNIT_META_SET:
      return unitMeta(state, action);
    case TK.TOKEN_VALUE_META_SET:
      return updateField('tokenValue')(state, action);
    case TK.TOKEN_TO_META_SET:
      return updateField('tokenTo')(state, action);
    case TK.GET_FROM_SUCCEEDED:
      return updateField('from')(state, action);
    case TK.TOKEN_TO_ETHER_SWAP:
      return tokenToEther(state, action);
    case TK.ETHER_TO_TOKEN_SWAP:
      return etherToToken(state, action);
    case TK.TOKEN_TO_TOKEN_SWAP:
      return tokenToToken(state, action);

    case TK.IS_VIEW_AND_SEND: {
      const nextState: State = { ...state, isContractInteraction: false };
      return nextState;
    }
    case TK.IS_CONTRACT_INTERACTION: {
      const nextState: State = { ...state, isContractInteraction: true };
      return nextState;
    }
    case TK.RESET_SUCCESSFUL:
      return reset(state);
    default:
      return state;
  }
};
