import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { CONTRACTS } from '@database/data';
import { ExtendedContract, LSKeys, TUuid } from '@types';

export const initialState = CONTRACTS || {};

const slice = createSlice({
  name: LSKeys.CONTRACTS,
  initialState,
  reducers: {
    create(state, action: PayloadAction<ExtendedContract>) {
      const { uuid } = action.payload;
      state[uuid] = action.payload;
    },
    destroy(state, action: PayloadAction<TUuid>) {
      const uuid = action.payload;
      delete state[uuid];
    },
    updateMany(state, action: PayloadAction<ExtendedContract[]>) {
      action.payload.forEach((contract) => {
        state[contract.uuid] = contract;
      });
    }
  }
});

export default slice;
