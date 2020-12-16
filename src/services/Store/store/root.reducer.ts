import { createAction, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { put } from 'redux-saga-test-plan/matchers';
import { select, takeLatest } from 'redux-saga/effects';

import demoReducer from '@features/DevTools/slice';
import { deMarshallState, marshallState } from '@services/Store/DataManager/utils';

import databaseSlice, { dbReset } from './database.reducer';
import { canImport } from './helpers';
import importSlice from './import.slice';
import membershipSlice from './membership.slice';
import { createPersistReducer, createVaultReducer } from './persist.config';
import { getAppState } from './selectors';
import tokenScanningSlice from './tokenScanning.slice';
import vaultSlice from './vault.slice';

const rootReducer = combineReducers({
  demo: demoReducer,
  [importSlice.name]: importSlice.reducer,
  [vaultSlice.name]: createVaultReducer(vaultSlice.reducer),
  [membershipSlice.name]: membershipSlice.reducer,
  [tokenScanningSlice.name]: tokenScanningSlice.reducer,
  [databaseSlice.name as 'database']: createPersistReducer(databaseSlice.reducer)
});

export default rootReducer;

export type AppState = ReturnType<typeof rootReducer>;

/**
 * Selectors
 */
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
    yield put(dbReset(marshallState(json)));
    yield put(importSlice.actions.success());
  } catch (err) {
    yield put(importSlice.actions.error(err));
  }
}
