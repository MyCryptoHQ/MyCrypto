import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ExtendedUserAction, LSKeys, TUuid } from '@types';
import { findIndex, propEq } from '@vendor';

import { initialLegacyState } from './legacy.initialState';
import { getAppState } from './selectors';

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
    },
    updateStateByName(state, action: PayloadAction<Omit<ExtendedUserAction, 'uuid'>>) {
      const idx = findIndex(propEq('name', action.payload.name), state);
      state[idx].state = action.payload.state;
    }
  }
});

export const {
  create: createUserAction,
  destroy: destroyUserAction,
  update: updateUserAction,
  updateStateByName: updateUserActionStateByName
} = slice.actions;

export const selectUserActions = createSelector(getAppState, (s) => s[slice.name]);

export default slice;
