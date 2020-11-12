import { LSKeys } from '@types';
import { identity } from '@vendor';

import { AppState } from './root.reducer';

/* Entities */
export const getAccounts = (state: AppState) => state[LSKeys.ACCOUNTS];
export const getAssets = (state: AppState) => state[LSKeys.ASSETS];
export const getContacts = (state: AppState) => state[LSKeys.ADDRESS_BOOK];
export const getContracts = (state: AppState) => state[LSKeys.CONTRACTS];
export const getNetworks = (state: AppState) => state[LSKeys.NETWORKS];
export const getSettings = (state: AppState) => state[LSKeys.SETTINGS];
export const getState = identity;

/* Other */
export const getUserActions = (state: AppState) => state[LSKeys.USER_ACTIONS];
export const getPassword = (state: AppState) => state[LSKeys.PASSWORD];
export const getVault = (state: AppState) => state.vault;
