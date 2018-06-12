import { Reducer } from 'redux';

import { getDecimalFromEtherUnit, TokenValue } from 'libs/units';
import {
  TRANSACTION,
  SwapTokenToEtherAction,
  SwapEtherToTokenAction,
  SwapTokenToTokenAction,
  SwapAction,
  ResetTransactionSuccessfulAction
} from '../types';
import { NetworkAction, GetFromSucceededAction } from '../network/types';
import {
  MetaAction,
  SetUnitMetaAction,
  TransactionMetaAction,
  SetTokenToMetaAction
} from './types';

export interface MetaState {
  unit: SetUnitMetaAction['payload'];
  previousUnit: SetUnitMetaAction['payload'];
  decimal: number;
  tokenValue: { raw: string; value: TokenValue | null }; // TODO: fix this workaround since some of the payload is optional
  tokenTo: SetTokenToMetaAction['payload'];
  from: GetFromSucceededAction['payload'] | null;
  isContractInteraction: boolean;
}

export const META_INITIAL_STATE: MetaState = {
  unit: '',
  previousUnit: '',
  decimal: getDecimalFromEtherUnit('ether'),
  tokenValue: { raw: '', value: null },
  tokenTo: { raw: '', value: null },
  from: null,
  isContractInteraction: false
};

//TODO: generic-ize updateField to reuse
const updateMetaField = (key: keyof MetaState): Reducer<MetaState> => (
  state: MetaState,
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

const tokenToEtherMeta = (state: MetaState, { payload }: SwapTokenToEtherAction): MetaState => {
  const { tokenValue, tokenTo } = META_INITIAL_STATE;
  return { ...state, tokenTo, tokenValue, decimal: payload.decimal };
};

const etherToTokenMeta = (
  state: MetaState,
  { payload: { data: _, to: __, ...rest } }: SwapEtherToTokenAction
): MetaState => ({ ...state, ...rest });

const tokenToTokenMeta = (
  state: MetaState,
  { payload: { data: _, to: __, ...rest } }: SwapTokenToTokenAction
): MetaState => ({ ...state, ...rest });

const resetMeta = (state: MetaState): MetaState => ({
  ...META_INITIAL_STATE,
  isContractInteraction: state.isContractInteraction,
  unit: state.unit
});

const unitMeta = (state: MetaState, { payload }: SetUnitMetaAction): MetaState => ({
  ...state,
  previousUnit: state.unit,
  unit: payload
});

export default function meta(
  state: MetaState = META_INITIAL_STATE,
  action: MetaAction | SwapAction | ResetTransactionSuccessfulAction | NetworkAction
): MetaState {
  switch (action.type) {
    case TRANSACTION.UNIT_META_SET:
      return unitMeta(state, action);
    case TRANSACTION.TOKEN_VALUE_META_SET:
      return updateMetaField('tokenValue')(state, action);
    case TRANSACTION.TOKEN_TO_META_SET:
      return updateMetaField('tokenTo')(state, action);
    case TRANSACTION.GET_FROM_SUCCEEDED:
      return updateMetaField('from')(state, action);
    case TRANSACTION.TOKEN_TO_ETHER_SWAP:
      return tokenToEtherMeta(state, action);
    case TRANSACTION.ETHER_TO_TOKEN_SWAP:
      return etherToTokenMeta(state, action);
    case TRANSACTION.TOKEN_TO_TOKEN_SWAP:
      return tokenToTokenMeta(state, action);

    case TRANSACTION.IS_VIEW_AND_SEND: {
      const nextState: MetaState = { ...state, isContractInteraction: false };
      return nextState;
    }
    case TRANSACTION.IS_CONTRACT_INTERACTION: {
      const nextState: MetaState = { ...state, isContractInteraction: true };
      return nextState;
    }
    case TRANSACTION.RESET_SUCCESSFUL:
      return resetMeta(state);
    default:
      return state;
  }
}
