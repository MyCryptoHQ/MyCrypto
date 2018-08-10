import * as types from './types';

export const INITIAL_STATE: types.CustomTokensState = [];

function addCustomToken(
  state: types.CustomTokensState,
  action: types.AddCustomTokenAction
): types.CustomTokensState {
  if (state.find(token => token.symbol === action.payload.symbol)) {
    return state;
  }
  return [...state, action.payload];
}

function removeCustomToken(
  state: types.CustomTokensState,
  action: types.RemoveCustomTokenAction
): types.CustomTokensState {
  return state.filter(token => token.symbol !== action.payload);
}

export function customTokensReducer(
  state: types.CustomTokensState = INITIAL_STATE,
  action: types.CustomTokenAction
): types.CustomTokensState {
  switch (action.type) {
    case types.CustomTokensActions.ADD:
      return addCustomToken(state, action);
    case types.CustomTokensActions.REMOVE:
      return removeCustomToken(state, action);
    default:
      return state;
  }
}
