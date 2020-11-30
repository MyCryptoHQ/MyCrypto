import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ExtendedContact, LSKeys, TUuid } from '@types';
import { findIndex, propEq } from '@vendor';

import { initialLegacyState } from './legacy.initialState';

const sliceName = LSKeys.ADDRESS_BOOK;
export const initialState = initialLegacyState[sliceName];

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    create(state, action: PayloadAction<ExtendedContact>) {
      state.push(action.payload);
    },
    destroy(state, action: PayloadAction<TUuid>) {
      const idx = findIndex(propEq('uuid', action.payload), state);
      state.splice(idx, 1);
    },
    update(state, action: PayloadAction<ExtendedContact>) {
      const idx = findIndex(propEq('uuid', action.payload.uuid), state);
      state[idx] = action.payload;
    }
  }
});

export const {
  create: createContact,
  destroy: destroyContact,
  update: updateContact
} = slice.actions;

export default slice;
