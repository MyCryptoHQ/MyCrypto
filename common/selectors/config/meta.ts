import { AppState } from 'reducers';
const getConfig = (state: AppState) => state.config;

export const getMeta = (state: AppState) => getConfig(state).meta;

export function getOffline(state: AppState): boolean {
  return getMeta(state).offline;
}

export function getAutoGasLimitEnabled(state: AppState): boolean {
  const meta = getMeta(state);
  return meta.autoGasLimit;
}

export function getLanguageSelection(state: AppState): string {
  return getMeta(state).languageSelection;
}

export function getLatestBlock(state: AppState) {
  return getMeta(state).latestBlock;
}
