import { hexlify } from '@ethersproject/bytes';
import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getPublicKey, utils } from 'noble-ed25519';
import { put } from 'redux-saga-test-plan/matchers';
import { call, select, takeLatest } from 'redux-saga/effects';

import { stripHexPrefix } from '@utils';

import { getAppState } from './selectors';

interface KeyPair {
  privateKey: string;
  publicKey: string;
}

export const initialState = {
  keyPair: undefined as KeyPair | undefined
};

const slice = createSlice({
  name: 'signer',
  initialState,
  reducers: {
    setKeyPair(state, action: PayloadAction<KeyPair>) {
      state.keyPair = action.payload;
    }
  }
});

export const { setKeyPair } = slice.actions;

export default slice;

export const signerInit = createAction(`${slice.name}/init`);

/**
 * Selectors
 */
// @ts-expect-error @todo fix typing here
const getState = createSelector(getAppState, (s) => s[slice.name]);
export const getKeyPair = createSelector(getState, (signer) => signer.keyPair);

/**
 * Sagas
 */
export function* signerSaga() {
  yield takeLatest(signerInit.type, initWorker);
}

export function* initWorker() {
  const keyPair: KeyPair = yield select(getKeyPair);

  if (!keyPair) {
    const privateKey = stripHexPrefix(hexlify(utils.randomPrivateKey()));
    const publicKey = yield call(getPublicKey, privateKey);
    yield put(setKeyPair({ privateKey, publicKey }));
  }
}
