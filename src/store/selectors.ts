import { createSelector } from '@reduxjs/toolkit';

import { deMarshallState } from '@services/Store/DataManager/utils';
import { LSKeys } from '@types';
import { identity } from '@vendor';

import { RootState } from './reducer';

/* Entities */
export const getAccounts = (state: RootState) => state.entities[LSKeys.ACCOUNTS];
export const getAssets = (state: RootState) => state.entities[LSKeys.ASSETS];
export const getContacts = (state: RootState) => state.entities[LSKeys.ADDRESS_BOOK];
export const getContracts = (state: RootState) => state.entities[LSKeys.CONTRACTS];
export const getNetworks = (state: RootState) => state.entities[LSKeys.NETWORKS];
export const getSettings = (state: RootState) => state[LSKeys.SETTINGS];
export const getState = identity;

/* Other */
export const getUserActions = (state: RootState) => state[LSKeys.USER_ACTIONS];

// State is our single source of truth so we use it for export instead of localstorage.
export const exportState = createSelector(identity, deMarshallState, JSON.stringify);
