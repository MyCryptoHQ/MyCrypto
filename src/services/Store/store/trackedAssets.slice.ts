import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { put, takeLatest } from 'redux-saga/effects';

import { TUuid } from '@types';

import { getAssetByUUID } from './asset.slice';
import { appReset, AppState } from './root.reducer';

export const initialState = [] as TUuid[];

const sliceName = 'trackedAssets';

/**
 * Store assets not present in accounts assets but needed for rates fetching
 */

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    trackAsset(state, action: PayloadAction<TUuid>) {
      return [...new Set([...state, action.payload])];
    },
    flush() {
      return [];
    }
  }
});

export const { trackAsset, flush } = slice.actions;

export default slice;

/**
 * Selectors
 */

export const getTrackedAssets = createSelector(
  [(s: AppState) => s[slice.name], (s) => s],
  (uuids, state) => uuids.map((uuid) => getAssetByUUID(uuid)(state)!)
);

/**
 * Sagas
 */

export function* trackedAssetsSaga() {
  yield takeLatest(appReset.type, flushTrackedAssets);
}

export function* flushTrackedAssets() {
  yield put(flush());
}
