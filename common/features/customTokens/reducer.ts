import {
  CUSTOM_TOKEN,
  AddCustomTokenAction,
  CustomTokenAction,
  RemoveCustomTokenAction,
  CustomTokensState
} from './types';

export const INITIAL_STATE: CustomTokensState = [];

function addCustomToken(state: CustomTokensState, action: AddCustomTokenAction): CustomTokensState {
  if (state.find(token => token.symbol === action.payload.symbol)) {
    return state;
  }
  return [...state, action.payload];
}

function removeCustomToken(
  state: CustomTokensState,
  action: RemoveCustomTokenAction
): CustomTokensState {
  return state.filter(token => token.symbol !== action.payload);
}

export function customTokensReducer(
  state: CustomTokensState = INITIAL_STATE,
  action: CustomTokenAction
): CustomTokensState {
  switch (action.type) {
    case CUSTOM_TOKEN.ADD:
      return addCustomToken(state, action);
    case CUSTOM_TOKEN.REMOVE:
      return removeCustomToken(state, action);
    default:
      return state;
  }
}
