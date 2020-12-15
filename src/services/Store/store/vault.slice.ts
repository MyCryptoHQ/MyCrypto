import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import { EncryptedDataStore } from '@types';
import { decrypt as decryptData, encrypt as encryptData } from '@utils';

import { initialLegacyState } from './legacy.initialState';
import { ActionT } from './legacy.reducer';
import { AppState, exportState, importState } from './reducer';

export const initialState: EncryptedDataStore = {
  data: undefined
};

const slice = createSlice({
  name: 'vault',
  initialState,
  reducers: {
    setEncryptedData(state, action: PayloadAction<string>) {
      state.data = action.payload;
    },
    clearEncryptedData() {
      return initialState;
    }
  }
});

export const { setEncryptedData, clearEncryptedData } = slice.actions;

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
  yield put({ type: ActionT.RESET, payload: { data: initialLegacyState } });
}

export function* decryptionWorker({ payload: passwordHash }: PayloadAction<string>) {
  const encryptedData = yield select(getEncryptedData);
  // Decrypt the data and store it to the MyCryptoCache
  const decryptedData = yield call(decryptData, encryptedData, passwordHash);
  yield put(clearEncryptedData());
  yield put(importState(decryptedData));
}
