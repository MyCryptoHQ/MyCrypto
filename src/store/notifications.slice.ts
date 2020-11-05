import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ExtendedNotification, LSKeys, TUuid } from '@types';

export const initialState = {} as Record<string, ExtendedNotification>;

const slice = createSlice({
  name: LSKeys.NOTIFICATIONS,
  initialState,
  reducers: {
    create(state, action: PayloadAction<ExtendedNotification>) {
      const { uuid } = action.payload;
      state[uuid] = action.payload;
    },
    destroy(state, action: PayloadAction<TUuid>) {
      delete state[action.payload];
    },
    update(state, action: PayloadAction<ExtendedNotification>) {
      const { uuid } = action.payload;
      state[uuid] = action.payload;
    },
    updateMany(state, action: PayloadAction<ExtendedNotification[]>) {
      action.payload.forEach((userAction) => {
        state[userAction.uuid] = userAction;
      });
    }
  }
});

export const {
  create: createNotification,
  destroy: destroyNotification,
  update: updateNotification,
  updateMany: updateNotifications
} = slice.actions;

export default slice.reducer;
