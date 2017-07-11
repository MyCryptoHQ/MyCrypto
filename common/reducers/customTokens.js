// @flow
import type {
  CustomTokenAction,
  AddCustomTokenAction,
  RemoveCustomTokenAction
} from 'actions/customTokens';
import type { Token } from 'config/data';

export type State = Token[];

const initialState: State = [];

function addCustomToken(state: State, action: AddCustomTokenAction): State {
  if (state.find(token => token.symbol === action.payload.symbol)) {
    return state;
  }
  return [...state, action.payload];
}

function removeCustomToken(state: State, action: RemoveCustomTokenAction): State {
  return state.filter(token => token.symbol !== action.payload);
}

export function customTokens(state: State = initialState, action: CustomTokenAction): State {
  switch (action.type) {
    case 'CUSTOM_TOKEN_ADD':
      return addCustomToken(state, action);
    case 'CUSTOM_TOKEN_REMOVE':
      return removeCustomToken(state, action);
    default:
      return state;
  }
}
