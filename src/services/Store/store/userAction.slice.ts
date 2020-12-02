import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ExtendedUserAction, LSKeys, TUuid } from '@types';
import { findIndex, propEq } from '@vendor';

import { initialLegacyState } from './legacy.initialState';

const sliceName = LSKeys.USER_ACTIONS;
export const initialState = initialLegacyState[sliceName];

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    create(state, action: PayloadAction<ExtendedUserAction>) {
      state.push(action.payload);
    },
    destroy(state, action: PayloadAction<TUuid>) {
      const idx = findIndex(propEq('uuid', action.payload), state);
      state.splice(idx, 1);
    },
    update(state, action: PayloadAction<ExtendedUserAction>) {
      const idx = findIndex(propEq('uuid', action.payload.uuid), state);
      state[idx] = action.payload;
    }
  }
});

export const {
  create: createUserAction,
  destroy: destroyUserAction,
  update: updateUserAction
} = slice.actions;

export default slice;
