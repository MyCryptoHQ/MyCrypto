import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import { EncryptedDataStore } from '@types';
import { decrypt as decryptData, isValidJSON } from '@utils';

import { AppState, importState } from './root.reducer';

export const initialState: EncryptedDataStore = {
  data: undefined,
  error: false
};

const slice = createSlice({
  name: 'vault',
  initialState,
  reducers: {
    clearEncryptedData() {
      return initialState;
    },
    decryptError(state) {
      state.error = true;
    }
  }
});

export const { clearEncryptedData, decryptError } = slice.actions;

export default slice;

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
  yield all([takeLatest(decrypt.type, decryptionWorker)]);
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
