import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ETHUUID } from '@config';
import { selectUserAssets } from '@store/account.slice';
import { selectAsset } from '@store/asset.slice';
import type { AppState } from '@store/root.reducer';
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
    },
    resetFormSlice() {
      return initialState;
    }
  }
});

export const { updateFormAsset, resetFormSlice } = slice.actions;

export default slice;

/**
 * Selectors
 */

export const selectSendAssetForm = (s: AppState) => s[slice.name];

export const selectFormAsset = createSelector(
  [selectSendAssetForm, selectUserAssets, selectAsset(ETHUUID)],
  (slice, userAssets, ETHAsset) => {
    const userAccountEthAsset = userAssets.find((a) => a.uuid === ETHUUID);
    const defaultAsset = (() => {
      if (userAccountEthAsset) {
        return userAccountEthAsset;
      } else if (userAssets.length > 0) {
        return userAssets[0];
      } else {
        return ETHAsset;
      }
    })();
    return slice.selectedAsset ? slice.selectedAsset : defaultAsset;
  }
);
