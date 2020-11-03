import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ExtendedContact, LSKeys, TUuid } from '@types';

export const initialState = {} as Record<string, ExtendedContact>;

const slice = createSlice({
  name: LSKeys.ADDRESS_BOOK,
  initialState,
  reducers: {
    create(state, action: PayloadAction<ExtendedContact>) {
      const { uuid } = action.payload;
      state[uuid] = action.payload;
    },
    destroy(state, action: PayloadAction<TUuid>) {
      delete state[action.payload];
    },
    update(state, action: PayloadAction<ExtendedContact>) {
      const { uuid } = action.payload;
      state[uuid] = action.payload;
    },
    updateMany(state, action: PayloadAction<ExtendedContact[]>) {
      action.payload.forEach((contact) => {
        state[contact.uuid] = contact;
      });
    },
    reset() {
      return initialState;
    }
  }
});

export default slice;
