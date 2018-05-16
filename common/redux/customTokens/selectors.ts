import { AppState } from 'redux/reducers';

export function getCustomTokens(state: AppState): AppState['customTokens'] {
  return state.customTokens;
}

export default {
  getCustomTokens
};
