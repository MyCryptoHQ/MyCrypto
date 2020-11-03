import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ExtendedContract, LSKeys, TUuid } from '@types';

export const initialState = {} as Record<string, ExtendedContract>;

const slice = createSlice({
  name: LSKeys.CONTRACTS,
  initialState,
  reducers: {
    create(state, action: PayloadAction<ExtendedContract>) {
      const { uuid } = action.payload;
      state[uuid] = action.payload;
    },
    destroy(state, action: PayloadAction<TUuid>) {
      delete state[action.payload];
    }
  }
});

export default slice;
