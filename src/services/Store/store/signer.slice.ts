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

export interface SignerState {
  keyPair?: KeyPair;
  nonce: number;
}

export const initialState: SignerState = {
  keyPair: undefined,
  nonce: 0
};

// @todo Put in connections slice?
const slice = createSlice({
  name: 'signer',
  initialState,
  reducers: {
    setKeyPair(state, action: PayloadAction<KeyPair>) {
      state.keyPair = action.payload;
    },
    incrementNonce(state) {
      state.nonce++;
    },
    setNonce(state, action: PayloadAction<number>) {
      state.nonce = action.payload;
    }
  }
});

export const { setKeyPair, incrementNonce, setNonce } = slice.actions;

export default slice;

export const signerInit = createAction(`${slice.name}/init`);

/**
 * Selectors
 */
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
