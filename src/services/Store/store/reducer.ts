import { createSelector, Selector } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import demoReducer from '@features/DevTools/slice';
import { DataStore } from '@types';

import legacyReducer from './legacy.reducer';
import { createPersistReducer } from './persist.config';

const rootReducer = combineReducers({
  demo: demoReducer,
  legacy: createPersistReducer(legacyReducer)
});

export default rootReducer;

export type AppState = ReturnType<typeof rootReducer>;

export const getAppState: Selector<AppState, DataStore> = (state) => state.legacy;

export const getPassword = createSelector([getAppState], (s) => s.password);
