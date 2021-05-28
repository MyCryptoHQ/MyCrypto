import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { AppState } from '@store';
import type { ExtendedAsset } from '@types';

interface State {
  selectedAsset?: ExtendedAsset;
}

export const initialState: State = {};

const slice = createSlice({
  name: 'sendAssets',
  initialState,
  reducers: {
    updateFormAsset(state, action: PayloadAction<ExtendedAsset>) {
      state.selectedAsset = action.payload;
    }
  }
});

export const { updateFormAsset } = slice.actions;

export default slice;

/**
 * Selectors
 */

export const selectSendAssetForm = (s: AppState) => s[slice.name];
export const selectFormAsset = createSelector([selectSendAssetForm], (s) => s.selectedAsset);
