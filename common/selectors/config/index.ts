import { AppState } from 'reducers';
export * from './meta';
export * from './networks';
export * from './nodes';
export * from './tokens';

export const getConfig = (state: AppState) => state.config;
