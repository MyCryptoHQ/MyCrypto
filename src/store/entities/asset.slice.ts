import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ExtendedAsset, LSKeys, TUuid } from '@types';

export const initialState = {} as Record<string, ExtendedAsset>;

const slice = createSlice({
  name: LSKeys.ASSETS,
  initialState,
  reducers: {
    create(state, action: PayloadAction<ExtendedAsset>) {
      const { uuid } = action.payload;
      state[uuid] = action.payload;
    },
    destroy(state, action: PayloadAction<TUuid>) {
      delete state[action.payload];
    },
    update(state, action: PayloadAction<ExtendedAsset>) {
      const { uuid } = action.payload;
      state[uuid] = action.payload;
    },
    updateMany(state, action: PayloadAction<ExtendedAsset[]>) {
      action.payload.forEach((account) => {
        state[account.uuid] = account;
      });
    },
    reset() {
      return initialState;
    }
  }
});

export default slice;
