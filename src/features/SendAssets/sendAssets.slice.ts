import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { AppState } from '@store';
import type { ExtendedAsset, NetworkId } from '@types';

interface State {
  selectedAsset?: ExtendedAsset;
  selectedNetworkId?: NetworkId;
}

export const initialState: State = {};

const slice = createSlice({
  name: 'SendAssets',
  initialState,
  reducers: {
    updateFormAsset(state, action: PayloadAction<ExtendedAsset>) {
      state.selectedAsset = action.payload;
      state.selectedNetworkId = action.payload.networkId;
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
export const selectFormNetwork = createSelector([selectSendAssetForm], (s) => s.selectedNetworkId);
