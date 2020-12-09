import { createAction, createSelector, Selector } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import demoReducer from '@features/DevTools/slice';
import { deMarshallState } from '@services/Store/DataManager';
import { DataStore } from '@types';
import { pipe } from '@vendor';

import legacyReducer from './legacy.reducer';
import membershipSlice from './membership.slice';
import { createPersistReducer } from './persist.config';

export const DATA_STATE_KEY = 'legacy';

const rootReducer = combineReducers({
  demo: demoReducer,
  [membershipSlice.name]: membershipSlice.reducer,
  [DATA_STATE_KEY]: createPersistReducer(legacyReducer)
});

export default rootReducer;

export type AppState = ReturnType<typeof rootReducer>;

/**
 * Selectors
 */

export const getAppState: Selector<AppState, DataStore> = (state) => state[DATA_STATE_KEY];
export const getPassword = createSelector([getAppState], (s) => s.password);

/**
 * AppState
 */
export const importState = createAction<AppState>('app/import');
export const exportState = createSelector(getAppState, pipe(deMarshallState, JSON.stringify));
