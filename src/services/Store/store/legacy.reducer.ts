import { combineReducers, createAction, PayloadAction, Reducer } from '@reduxjs/toolkit';

import { DataStore } from '@types';

import accountSlice from './account.slice';
import assetSlice from './asset.slice';
import contactSlice from './contact.slice';
import contractSlice from './contract.slice';
import { initialLegacyState } from './legacy.initialState';
import networkSlice from './network.slice';
import notificationSlice from './notification.slice';
import passwordSlice from './password.slice';
import settingsSlice from './settings.slice';
import userActionSlice from './userAction.slice';

const dbReducer = combineReducers({
  version: () => initialLegacyState.version,
  [accountSlice.name]: accountSlice.reducer,
  [assetSlice.name]: assetSlice.reducer,
  [contactSlice.name]: contactSlice.reducer,
  [contractSlice.name]: contractSlice.reducer,
  [networkSlice.name]: networkSlice.reducer,
  [notificationSlice.name]: notificationSlice.reducer,
  [settingsSlice.name]: settingsSlice.reducer,
  [userActionSlice.name]: userActionSlice.reducer,
  [passwordSlice.name]: passwordSlice.reducer
});

export const dbReset = createAction<DataStore>('app/Reset');

const legacyReducer: Reducer<DataStore, PayloadAction<any>> = (
  state = initialLegacyState,
  action
) => {
  switch (action.type) {
    case dbReset.type: {
      return action.payload;
    }
    default: {
      return dbReducer(state, action);
    }
  }
};

export default legacyReducer;
