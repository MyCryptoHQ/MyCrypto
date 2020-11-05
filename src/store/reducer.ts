import { PayloadAction } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import demoReducer from '@features/DevTools/slice';
import { marshallState } from '@services/Store/DataManager/utils';
import { LSKeys } from '@types';

import { importState } from './actions';
import entitiesReducer from './entities';
import notificationsReducer from './notifications.slice';
import settingsReducer from './settings';
import userActionsReducer from './userActions.slice';

const combinedReducers = combineReducers({
  demo: demoReducer,
  entities: entitiesReducer,
  [LSKeys.USER_ACTIONS]: userActionsReducer,
  [LSKeys.SETTINGS]: settingsReducer,
  [LSKeys.NOTIFICATIONS]: notificationsReducer
});

export type RootState = ReturnType<typeof combinedReducers> & { importError?: boolean };

const rootReducer = (state: RootState, action: PayloadAction<any>): RootState => {
  if (action.type === importState.name) {
    const data = action.payload;
    try {
      const d = JSON.parse(data);
      const s = marshallState(d);
      return {
        ...state,
        ...s
      };
    } catch {
      console.debug('Failed state import ');
      return {
        ...state,
        importError: true
      };
    }
  }

  return combinedReducers(state, action);
};

export default rootReducer;
