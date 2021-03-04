import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Asset, LSKeys } from '@types';

import { getAppState } from './selectors';

export const initialState = [] as Asset[];

const sliceName = LSKeys.TRACKED_ASSETS;

/**
 * Store assets not present in accounts assets but needed for rates fetching
 */

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    trackAsset(state, action: PayloadAction<Asset>) {
      return [...new Set([...state, action.payload])];
    },
    trackAssets(state, action: PayloadAction<Asset[]>) {
      return [...new Set([...state, ...action.payload])];
    }
  }
});

export const { trackAsset, trackAssets } = slice.actions;

export default slice;

/**
 * Selectors
 */

export const getTrackedAssets = createSelector([getAppState], (s) => s[slice.name]);
