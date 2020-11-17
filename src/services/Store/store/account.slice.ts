import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IAccount, LSKeys, TUuid } from '@types';

export const initialState = {} as Record<string, IAccount>;

const sliceName = LSKeys.ACCOUNTS;

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    create(state, action: PayloadAction<IAccount>) {
      const { uuid } = action.payload;
      state[uuid] = action.payload;
    },
    destroy(state, action: PayloadAction<TUuid>) {
      delete state[action.payload];
    },
    update(state, action: PayloadAction<IAccount>) {
      const { uuid } = action.payload;
      state[uuid] = action.payload;
    },
    reset() {
      return initialState;
    }
  }
});

export const {
  create: createAccount,
  destroy: destroyAccount,
  update: updateAccount,
  reset: resetAccount
} = slice.actions;

export default slice;
