import { Selector } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import demoReducer from '@features/DevTools/slice';
import { DataStore } from '@types';

import accountReducer from './account.slice';
import legacyReducer from './legacy.reducer';
import { createPersistReducer } from './persist.config';

const rootReducer = combineReducers({
  demo: demoReducer,
  [accountReducer.name]: accountReducer.reducer,
  legacy: createPersistReducer(legacyReducer)
});

export default rootReducer;
export type AppState = ReturnType<typeof rootReducer>;
export const getAppState: Selector<ReturnType<typeof rootReducer>, DataStore> = (state) =>
  state.legacy;
