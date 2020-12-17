import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import { EncryptedDataStore } from '@types';
import { decrypt as decryptData, encrypt as encryptData, isValidJSON } from '@utils';

import { initialLegacyState } from './legacy.initialState';
import { appReset, AppState, exportState, importState } from './root.reducer';

export const initialState: EncryptedDataStore = {
  data: undefined,
  error: false
};

const slice = createSlice({
  name: 'vault',
  initialState,
  reducers: {
    setEncryptedData(state, action: PayloadAction<string>) {
      state.data = action.payload;
      state.error = false;
    },
    clearEncryptedData() {
      return initialState;
    },
    decryptError(state) {
      state.error = true;
    }
  }
});

export const { setEncryptedData, clearEncryptedData, decryptError } = slice.actions;

export default slice;

export const encrypt = createAction<string>(`${slice.name}/encrypt`);
export const decrypt = createAction<string>(`${slice.name}/decrypt`);

/**
 * Selectors
 */
export const getEncryptedData = createSelector(
  (s: AppState) => s[slice.name],
  (s) => s.data
);
export const isEncrypted = createSelector(getEncryptedData, (d) => d !== undefined);
export const getDecryptionError = createSelector(
  (s: AppState) => s[slice.name],
  (s) => s.error
);

/**
 * Sagas
 */
export function* vaultSaga() {
  yield all([
    takeLatest(encrypt.type, encryptionWorker),
    takeLatest(decrypt.type, decryptionWorker)
  ]);
}

export function* encryptionWorker({ payload: password }: PayloadAction<string>) {
  const state = yield select(exportState);

  const encryptedData = yield call(encryptData, JSON.stringify(state), password);

  yield put(setEncryptedData(encryptedData.toString()));
  yield put(appReset(initialLegacyState));
}

export function* decryptionWorker({ payload: passwordHash }: PayloadAction<string>) {
  const encryptedData = yield select(getEncryptedData);
  try {
    const decryptedData = yield call(decryptData, encryptedData, passwordHash);
    // We dont care about the error as we show a invalid password error if the decrypted data isnt valid json.
    if (!isValidJSON(decryptedData)) {
      throw Error();
    }
    yield put(clearEncryptedData());
    yield put(importState(decryptedData));
  } catch {
    yield put(decryptError());
  }
}
