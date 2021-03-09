import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ExtendedNotification, LSKeys } from '@types';
import { findIndex, propEq } from '@vendor';

import { getAppState } from './selectors';

export const initialState = [] as ExtendedNotification[];

const slice = createSlice({
  name: LSKeys.NOTIFICATIONS,
  initialState,
  reducers: {
    create(state, action: PayloadAction<ExtendedNotification>) {
      state.push(action.payload);
    },

    update(state, action: PayloadAction<ExtendedNotification>) {
      const idx = findIndex(propEq('uuid', action.payload.uuid), state);
      state[idx] = action.payload;
    }
  }
});

export const { create: createNotification, update: updateNotification } = slice.actions;

export const selectNotifications = createSelector(getAppState, (s) => s[slice.name]);

export default slice;
