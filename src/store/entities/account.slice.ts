import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IAccount, LSKeys, TUuid } from '@types';

import { serializeAccount } from './helpers';

export const initialState = {} as Record<string, IAccount>;

const sliceName = LSKeys.ACCOUNTS;

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    create(state, action: PayloadAction<IAccount>) {
      const { uuid } = action.payload;
      state[uuid] = serializeAccount(action.payload);
    },
    destroy(state, action: PayloadAction<TUuid>) {
      delete state[action.payload];
    },
    update(state, action: PayloadAction<IAccount>) {
      const { uuid } = action.payload;
      state[uuid] = serializeAccount(action.payload);
    },
    updateMany(state, action: PayloadAction<IAccount[]>) {
      action.payload.forEach((account) => {
        state[account.uuid] = serializeAccount(account);
      });
    },
    reset() {
      return initialState;
    }
  }
});

export default slice;
