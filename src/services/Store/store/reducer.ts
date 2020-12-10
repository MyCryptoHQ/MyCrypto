import { createAction, createSelector, PayloadAction, Selector } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { put } from 'redux-saga-test-plan/matchers';
import { select, takeLatest } from 'redux-saga/effects';

import demoReducer from '@features/DevTools/slice';
import { deMarshallState, marshallState } from '@services/Store/DataManager/utils';
import { DataStore } from '@types';
import { log } from '@utils';

import { canImport } from './helpers';
import importSlice from './import.slice';
import legacyReducer, { ActionT } from './legacy.reducer';
import membershipSlice from './membership.slice';
import { createPersistReducer } from './persist.config';

export const DATA_STATE_KEY = 'legacy';

const rootReducer = combineReducers({
  demo: demoReducer,
  [importSlice.name]: importSlice.reducer,
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
export const exportState = createSelector(getAppState, deMarshallState);
export const importState = createAction<string>('app/import');

export function* importSaga() {
  yield takeLatest(importState.type, importWorker);
}

function* importWorker({ payload }: PayloadAction<string>) {
  const persistable = yield select(exportState);
  try {
    // @todo: Do migration instead of failing
    const json = JSON.parse(payload);
    if (!canImport(json, persistable)) {
      throw new Error('Invalid import file');
    }
    yield put({ type: ActionT.RESET, payload: { data: marshallState(json) } });
    yield put(importSlice.actions.success());
  } catch (err) {
    log('Import failed', err);
    yield put(importSlice.actions.error(err));
  }
}
