import { createSelector, createSlice } from '@reduxjs/toolkit';

import { LSKeys } from '@types';

import { initialLegacyState } from './legacy.initialState';
import { getAppState } from './selectors';

const sliceName = LSKeys.PASSWORD;
export const initialState = initialLegacyState[sliceName];

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    reset() {
      return initialState;
    }
  }
});

export const { reset: resetPassword } = slice.actions;

export const selectPassword = createSelector(getAppState, (s) => s[slice.name]);

export default slice;
