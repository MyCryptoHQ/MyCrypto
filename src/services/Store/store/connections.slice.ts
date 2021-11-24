import { DeterministicWallet, Wallet } from '@mycrypto/wallets';
import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { all, put, takeLatest } from 'redux-saga/effects';

import { LSKeys, WalletId } from '@types';
import { isGridPlusWallet } from '@utils';

import { getAppState } from './selectors';

// @todo Better name?
const sliceName = LSKeys.CONNECTIONS;

// @todo Long term could store WC stuff too
export interface ConnectionsState {
  wallets: Record<string, { wallet: WalletId; data: any }>;
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

export const connectWallet = createAction<Wallet | DeterministicWallet>(`${slice.name}/connect`);

export const { setWalletData } = slice.actions;

export default slice;

/**
 * Selectors
 */

export const getSlice = createSelector([getAppState], (s) => s[slice.name]);

export const getWalletConnections = createSelector([getSlice], (s) => Object.values(s.wallets));

export const getWalletConnection = (wallet: WalletId) =>
  createSelector(
    [getWalletConnections],
    (wallets) => wallets.find((p) => p.wallet === wallet)?.data
  );

/**
 * Sagas
 */
export function* connectionsSaga() {
  yield all([takeLatest(connectWallet.type, gridPlusWorker)]);
}

export function* gridPlusWorker({ payload }: PayloadAction<DeterministicWallet>) {
  const credentials = payload && isGridPlusWallet(payload) && payload.getCredentials();
  if (credentials) {
    yield put(setWalletData({ wallet: WalletId.GRIDPLUS, data: credentials }));
  }
}
