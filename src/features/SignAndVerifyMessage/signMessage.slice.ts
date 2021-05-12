import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import { IFullWallet } from '@services/WalletService';
import type { AppState } from '@store';
import { ISignedMessage, NetworkId, TAddress, WalletId } from '@types';
import { addHexPrefix } from '@utils';

interface State {
  status: 'SIGN_SUCCESS' | 'SIGN_REQUEST' | 'SIGN_FAILURE' | 'INIT';
  walletId?: WalletId;
  walletInfo?: { address: TAddress; network: NetworkId };
  error?: string;
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
    walletSelect(state, action) {
      state.walletId = action.payload;
    },
    walletUnlock(state, action) {
      state.walletInfo = action.payload; // Array.isArray(selectedWallet) ? selectedWallet[0] : selectedWallet
    },
    updateMessage(state, action) {
      state.message = action.payload;
      state.status = 'INIT';
      delete state.error;
    },
    request(state) {
      state.status = 'SIGN_REQUEST';
      delete state.error;
    },
    success(state, action) {
      state.status = 'SIGN_SUCCESS';
      state.signedMessage = action.payload;
      delete state.error;
    },
    failure(state, action: PayloadAction<State['error']>) {
      state.status = 'SIGN_FAILURE';
      state.error = action.payload;
    },
    reset() {
      return initialState;
    }
  }
});

export default signMessageSlice;

export const {
  walletUnlock,
  updateMessage,
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
export const selectWalletInfo = createSelector(selectSlice, (s) => s.walletInfo);

export const signMessage = createAction<{ message: string; wallet: IFullWallet }>(
  `${signMessageSlice.name}/signMessage`
);

export function* signMessageSaga() {
  yield all([yield takeLatest(signMessage.type, signMessageWorker)]);
}

function* signMessageWorker({ payload }: PayloadAction<{ message: string; wallet: IFullWallet }>) {
  const { message, wallet } = payload;
  const walletInfo = yield select(selectWalletInfo);

  yield put(signMessageRequest());

  try {
    const sig: string = yield call({ context: wallet, fn: wallet.signMessage }, message);

    yield put(
      signMessageSuccess({
        address: walletInfo.address,
        msg: message,
        sig: addHexPrefix(sig),
        version: '2'
      })
    );
  } catch (err) {
    yield put(signMessageFailure(err));
  }
}
