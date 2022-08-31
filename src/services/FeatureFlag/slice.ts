import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { FEATURE_FLAGS } from '@config';
import { AppState } from '@store';

const sliceName = 'featureFlags';
export type FeatureFlag = keyof typeof FEATURE_FLAGS;
export type FeatureFlags = Record<FeatureFlag, string | boolean>;
export const initialState: FeatureFlags = FEATURE_FLAGS;

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    set(state, action: PayloadAction<{ feature: FeatureFlag; isActive: boolean }>) {
      const { feature, isActive } = action.payload;
      state[feature] = isActive;
    },
    reset() {
      return initialState;
    }
  }
});

export const getFeatureFlags = (s: AppState) => s[sliceName];
export const isActiveFeature = (feature: FeatureFlag) =>
  createSelector(getFeatureFlags, (features): boolean => !!features[feature]);

export const { set: setFeatureFlag, reset: resetFeatureFlags } = slice.actions;

export default slice;
