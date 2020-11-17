import { Selector } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import demoReducer from '@features/DevTools/slice';
import { appDataReducer as legacyReducer } from '@services/Store/DataManager/reducer';
import { DataStore } from '@types';

import entitiesReducer from './entities';

const rootReducer = combineReducers({
  demo: demoReducer,
  entities: entitiesReducer,
  legacy: legacyReducer
});

export default rootReducer;
export type AppState = ReturnType<typeof rootReducer>;
export const getAppState: Selector<ReturnType<typeof rootReducer>, DataStore> = (state) =>
  state.legacy;
