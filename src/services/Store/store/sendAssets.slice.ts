import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { head } from 'lodash';

import { ETHUUID } from '@config';
import type { ExtendedAsset } from '@types';
import { cond, has, length, prop, T } from '@vendor';

import { selectUserAssets } from './account.slice';
import { selectAsset } from './asset.slice';
import type { AppState } from './root.reducer';

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
    return cond([
      [has('selectedAsset'), prop('selectedAsset')],
      [() => length(userAssets) >= 0, () => head(userAssets)],
      [T, () => ETHAsset]
    ])(slice);
  }
);
