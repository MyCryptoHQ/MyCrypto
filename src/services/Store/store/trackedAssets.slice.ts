import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ExtendedAsset, IProvidersMappings, LSKeys } from '@types';

import { getAppState } from './selectors';

export const initialState = {} as Record<string, IProvidersMappings>;

const sliceName = LSKeys.TRACKED_ASSETS;

/**
 * Store assets not present in accounts assets but needed for rates fetching
 */

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    trackAsset(state, action: PayloadAction<ExtendedAsset>) {
      return { ...state, [action.payload.uuid]: { ...action.payload.mappings } };
    }
  }
});

export const { trackAsset } = slice.actions;

export default slice;

/**
 * Selectors
 */

export const getTrackedAssets = createSelector([getAppState], (s) => s[slice.name]);
