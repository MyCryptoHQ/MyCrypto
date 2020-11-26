import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ExtendedAsset, LSKeys, TUuid } from '@types';
import { findIndex, propEq } from '@vendor';

import { initialLegacyState } from './legacy.initialState';

const sliceName = LSKeys.ASSETS;
export const initialState = initialLegacyState[sliceName];

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    create(state, action: PayloadAction<ExtendedAsset>) {
      state.push(action.payload);
    },
    createMany(state, action: PayloadAction<ExtendedAsset[]>) {
      action.payload.forEach((a) => {
        state.push(a);
      });
    },
    destroy(state, action: PayloadAction<TUuid>) {
      const idx = findIndex(propEq('uuid', action.payload), state);
      state.splice(idx, 1);
    },
    update(state, action: PayloadAction<ExtendedAsset>) {
      const idx = findIndex(propEq('uuid', action.payload.uuid), state);
      state[idx] = action.payload;
    },
    updateMany(state, action: PayloadAction<ExtendedAsset[]>) {
      const assets = action.payload;
      assets.forEach((asset) => {
        const idx = findIndex(propEq('uuid', asset.uuid), state);
        state[idx] = asset;
      });
    },
    reset() {
      return initialState;
    }
  }
});

export const {
  create: createAsset,
  createMany: createAssets,
  destroy: destroyAsset,
  update: updateAsset,
  updateMany: updateAssets,
  reset: resetAsset
} = slice.actions;

export default slice;
