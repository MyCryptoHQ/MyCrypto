import { GridPlusWallet } from '@mycrypto/wallets';
import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { all, put, takeLatest } from 'redux-saga/effects';

import { requestConnectionSuccess } from '@features/AddAccount/components/hdWallet.slice';
import { LSKeys, WalletId } from '@types';

import { getAppState } from './selectors';

// @todo Better name?
const sliceName = LSKeys.CONNECTIONS;

// @todo Long term could store WC stuff too
export interface ConnectionsState {
  wallets: Record<WalletId, { wallet: WalletId; data: unknown }>;
}

export const initialState = { wallets: {} } as ConnectionsState;

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    setWalletData(state, action: PayloadAction<{ wallet: WalletId; data: unknown }>) {
      state.wallets[action.payload.wallet] = action.payload;
    }
  }
});

export const checkForPromos = createAction(`${slice.name}/check`);

export const { setWalletData } = slice.actions;

export default slice;

/**
 * Selectors
 */

export const getSlice = createSelector([getAppState], (s) => s[slice.name]);

export const getWalletConnections = createSelector([getSlice], (s) => Object.values(s.wallets));

export const getWalletConnection = (wallet: WalletId) =>
  createSelector([getWalletConnections], (wallets) => wallets.find((p) => p.wallet === wallet));

/**
 * Sagas
 */
export function* connectionsSaga() {
  yield all([takeLatest(requestConnectionSuccess.type, gridPlusWorker)]);
}

export function* gridPlusWorker() {
  // @todo Get
  const session = null;
  const credentials = session && (session as GridPlusWallet).getCredentials();
  if (credentials) {
    yield put(setWalletData({ wallet: WalletId.GRIDPLUS, data: credentials }));
  }
}
