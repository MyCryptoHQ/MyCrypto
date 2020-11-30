import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { LSKeys } from '@types';

import { initialLegacyState } from './legacy.initialState';

const sliceName = LSKeys.PASSWORD;
export const initialState = initialLegacyState[sliceName];

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    set(_, action: PayloadAction<string>) {
      return action.payload;
    },
    reset() {
      return initialState;
    }
  }
});

export const { set: setPassword, reset: resetPassword } = slice.actions;

export default slice;
