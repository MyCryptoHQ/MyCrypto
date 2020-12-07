import { createSelector, Selector } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import demoReducer from '@features/DevTools/slice';
import { DataStore } from '@types';

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

export const getAppState: Selector<AppState, DataStore> = (state) => state[DATA_STATE_KEY];

export const getPassword = createSelector([getAppState], (s) => s.password);
