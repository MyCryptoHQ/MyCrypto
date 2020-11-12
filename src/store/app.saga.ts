import { call, put, takeEvery } from 'redux-saga/effects';

import { marshallPersistenceToState } from '@services/Store/DataManager/utils';
import { exportState, setStoreState } from '@store';

import { importFailure, importState, importSuccess } from './app.reducer';
import { isValidImport } from './helpers';

function* importWorker(action: ReturnType<typeof importState>) {
  const currentState = yield call(exportState);
  const isValid = isValidImport(action.payload, currentState);
  if (isValid) {
    const importedState = JSON.parse(action.payload);
    const nextState = marshallPersistenceToState(importedState);
    yield put(setStoreState(nextState));
    yield put(importSuccess());
  } else {
    yield put(importFailure());
  }
}

export function* importStateWatcher() {
  yield takeEvery(importState.type, importWorker);
}
