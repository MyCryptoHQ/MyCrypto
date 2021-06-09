import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ExtendedContract, LSKeys, TUuid } from '@types';
import { findIndex, propEq } from '@vendor';

import { initialLegacyState } from './legacy.initialState';
import { getAppState } from './selectors';

const sliceName = LSKeys.CONTRACTS;
export const initialState = initialLegacyState[sliceName];

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    create(state, action: PayloadAction<ExtendedContract>) {
      state.push(action.payload);
    },
    destroy(state, action: PayloadAction<TUuid>) {
      const idx = findIndex(propEq('uuid', action.payload), state);
      state.splice(idx, 1);
    }
  }
});

export const { create: createContract, destroy: destroyContract } = slice.actions;
export const selectContracts = createSelector(getAppState, (s) => s[slice.name]);

export default slice;
