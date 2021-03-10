import { AnyAction, createAction, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { put } from 'redux-saga-test-plan/matchers';
import { select, takeLatest } from 'redux-saga/effects';

import { featureFlagSlice } from '@services/FeatureFlag';
import { deMarshallState, marshallState } from '@services/Store/DataManager/utils';

import { canImport, migrateConfig } from './helpers';
import importSlice from './import.slice';
import { initialLegacyState } from './legacy.initialState';
import membershipSlice from './membership.slice';
import { createPersistReducer, createVaultReducer } from './persist.config';
import persistenceSlice from './persistence.slice';
import { getAppState } from './selectors';
import tokenScanningSlice from './tokenScanning.slice';
import vaultSlice from './vault.slice';

const reducers = combineReducers({
  [importSlice.name]: importSlice.reducer,
  [vaultSlice.name]: createVaultReducer(vaultSlice.reducer),
  [membershipSlice.name]: membershipSlice.reducer,
  [tokenScanningSlice.name]: tokenScanningSlice.reducer,
  [persistenceSlice.name as 'database']: createPersistReducer(persistenceSlice.reducer),
  [featureFlagSlice.name]: featureFlagSlice.reducer
});

/**
 * Actions
 */
export const appReset = createAction('app/Reset', (newDb = initialLegacyState) => ({
  payload: newDb
}));

const rootReducer = (state = reducers(undefined, { type: '' }), action: AnyAction) => {
  switch (action.type) {
    case appReset.type: {
      return {
        ...state,
        [persistenceSlice.name]: { ...action.payload, _persist: state.database._persist }
      };
    }
    default: {
      return reducers(state, action);
    }
  }
};

export default rootReducer;

export type AppState = ReturnType<typeof rootReducer>;

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
    const json = migrateConfig(JSON.parse(payload));

    if (!canImport(json, persistable)) {
      throw new Error('Invalid import file');
    }

    yield put(appReset(marshallState(json)));
    yield put(importSlice.actions.success());
  } catch (err) {
    yield put(importSlice.actions.error(err));
  }
}
