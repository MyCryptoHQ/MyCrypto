import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { TUuid } from '@types';

import { getAssetByUUID } from './asset.slice';
import { AppState } from './root.reducer';

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
    }
  }
});

export const { trackAsset } = slice.actions;

export default slice;

/**
 * Selectors
 */

export const getTrackedAssets = createSelector(
  [(s: AppState) => s[slice.name], (s) => s],
  (uuids, state) => uuids.map((uuid) => getAssetByUUID(uuid)(state))
);

/**
 * Actions
 */
