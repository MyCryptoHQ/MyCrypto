import { AppState } from 'features/reducers';

export function getCustomTokens(state: AppState): AppState['customTokens'] {
  return state.customTokens;
}
