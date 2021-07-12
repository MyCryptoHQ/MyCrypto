import { getAddress } from '@ethersproject/address';
import { TAddress, Wallet } from '@mycrypto/wallets';
import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { all, call, put, takeLatest } from 'redux-saga/effects';

import { IFullWallet } from '@services/WalletService';
import type { AppState } from '@store';
import { ISignedMessage, WalletId } from '@types';
import { addHexPrefix } from '@utils';

interface State {
  status: 'SIGN_SUCCESS' | 'SIGN_REQUEST' | 'SIGN_FAILURE' | 'INIT';
  walletId?: WalletId;
  error?: true;
  message?: string;
  signedMessage?: ISignedMessage;
}

export const initialState: State = {
  status: 'INIT'
};

export const signMessageSlice = createSlice({
  name: 'signMessage',
  initialState,
  reducers: {
    walletSelect(state, action: PayloadAction<WalletId>) {
      state.walletId = action.payload;
    },
    messageUpdate(state, action: PayloadAction<string>) {
      state.message = action.payload;
      state.status = 'INIT';
      delete state.error;
    },
    request(state) {
      state.status = 'SIGN_REQUEST';
      delete state.error;
    },
    success(state, action: PayloadAction<ISignedMessage>) {
      state.status = 'SIGN_SUCCESS';
      state.signedMessage = action.payload;
      delete state.error;
    },
    failure(state) {
      state.status = 'SIGN_FAILURE';
      state.error = true;
    },
    reset() {
      return initialState;
    }
  }
});

export default signMessageSlice;

export const {
  messageUpdate,
  walletSelect,
  request: signMessageRequest,
  success: signMessageSuccess,
  failure: signMessageFailure,
  reset: signMessageReset
} = signMessageSlice.actions;

export const selectSlice = (state: AppState) => state[signMessageSlice.name];
export const selectSignMessageStatus = createSelector(selectSlice, (s) => s.status);
export const selectSignMessageError = createSelector(selectSlice, (s) => s.error);
export const selectSignedMessage = createSelector(selectSlice, (s) => s.signedMessage);
export const selectMessage = createSelector(selectSlice, (s) => s.message);
export const selectWalletId = createSelector(selectSlice, (s) => s.walletId);

export const signMessage = createAction<{ message: string; wallet: Wallet | IFullWallet }>(
  `${signMessageSlice.name}/signMessage`
);

export function* signMessageSaga() {
  yield all([yield takeLatest(signMessage.type, signMessageWorker)]);
}

export function* signMessageWorker({
  payload
}: PayloadAction<{ message: string; wallet: Wallet | IFullWallet }>) {
  const { message, wallet } = payload;
  yield put(signMessageRequest());

  try {
    const sig: string = yield call({ context: wallet, fn: wallet.signMessage }, message);
    const address: TAddress = yield call({ context: wallet, fn: wallet.getAddress });
    yield put(
      signMessageSuccess({
        address: getAddress(address),
        msg: message,
        sig: addHexPrefix(sig),
        version: '2'
      })
    );
  } catch (err) {
    yield put(signMessageFailure());
  }
}
