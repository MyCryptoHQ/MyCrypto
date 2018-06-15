import * as customTokensTypes from './types';

export const INITIAL_STATE: customTokensTypes.CustomTokensState = [];

function addCustomToken(
  state: customTokensTypes.CustomTokensState,
  action: customTokensTypes.AddCustomTokenAction
): customTokensTypes.CustomTokensState {
  if (state.find(token => token.symbol === action.payload.symbol)) {
    return state;
  }
  return [...state, action.payload];
}

function removeCustomToken(
  state: customTokensTypes.CustomTokensState,
  action: customTokensTypes.RemoveCustomTokenAction
): customTokensTypes.CustomTokensState {
  return state.filter(token => token.symbol !== action.payload);
}

export function customTokensReducer(
  state: customTokensTypes.CustomTokensState = INITIAL_STATE,
  action: customTokensTypes.CustomTokenAction
): customTokensTypes.CustomTokensState {
  switch (action.type) {
    case customTokensTypes.CustomTokensActions.ADD:
      return addCustomToken(state, action);
    case customTokensTypes.CustomTokensActions.REMOVE:
      return removeCustomToken(state, action);
    default:
      return state;
  }
}
