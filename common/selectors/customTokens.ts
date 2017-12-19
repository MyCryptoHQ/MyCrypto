import { AppState } from 'reducers';

export function getCustomTokens(state: AppState): AppState['customTokens'] {
  return state.customTokens;
}
