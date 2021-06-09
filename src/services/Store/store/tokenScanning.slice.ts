import { createAction, createSelector, createSlice } from '@reduxjs/toolkit';

import { Asset, IAccount } from '@types';
import { identity } from '@vendor';

import { AppState } from './root.reducer';

export const initialState = {
  scanning: false
};

const slice = createSlice({
  name: 'tokenScanning',
  initialState,
  reducers: {
    startTokenScan(state) {
      state.scanning = true;
    },
    finishTokenScan(state) {
      state.scanning = false;
    }
  }
});

export const scanTokens = createAction<{ accounts?: IAccount[]; assets?: Asset[] } | undefined>(
  `${slice.name}/scanTokens`
);

export const { startTokenScan, finishTokenScan } = slice.actions;

export default slice;

/**
 * Selectors
 */

export const isScanning = createSelector(
  (state: AppState) => state.tokenScanning.scanning,
  identity
);
