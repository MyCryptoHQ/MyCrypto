import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ExtendedUserAction, LSKeys, TUuid } from '@types';

export const initialState = {} as Record<string, ExtendedUserAction>;

const slice = createSlice({
  name: LSKeys.USER_ACTIONS,
  initialState,
  reducers: {
    create(state, action: PayloadAction<ExtendedUserAction>) {
      const { uuid } = action.payload;
      state[uuid] = action.payload;
    },
    destroy(state, action: PayloadAction<TUuid>) {
      delete state[action.payload];
    },
    update(state, action: PayloadAction<ExtendedUserAction>) {
      const { uuid } = action.payload;
      state[uuid] = action.payload;
    },
    updateMany(state, action: PayloadAction<ExtendedUserAction[]>) {
      action.payload.forEach((userAction) => {
        state[userAction.uuid] = userAction;
      });
    }
  }
});

export const {
  create: createUserAction,
  destroy: destroyUserAction,
  update: updateUserAction,
  updateMany: updateUserActions
} = slice.actions;

export default slice.reducer;
