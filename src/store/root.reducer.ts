import { AnyAction, combineReducers, createAction } from '@reduxjs/toolkit';

import { LSKeys } from '@types';

import appReducer from './app.reducer';
import entitiesReducer from './entities';
import notificationsReducer from './notifications.slice';
import settingsReducer from './settings';
import userActionsReducer from './userActions.slice';
import vaultReducer from './vault.slice';

const combinedReducers = combineReducers({
  vault: vaultReducer,
  ...entitiesReducer,
  [LSKeys.USER_ACTIONS]: userActionsReducer,
  [LSKeys.SETTINGS]: settingsReducer,
  [LSKeys.NOTIFICATIONS]: notificationsReducer
});

/**
 * This is the reference type for our state of our redux store.
 */
export type AppState = ReturnType<typeof combinedReducers> & {
  importSuccess: true;
  importError: true;
  [LSKeys.PASSWORD]?: string;
};

export const setPassword = createAction<string>('state/password');
setPassword.type = setPassword.toString();

export const resetState = createAction('state/reset');

export const setStoreState = createAction<AppState>('state/set');
setStoreState.type = setStoreState.toString();

const rootReducer = (state: AppState, action: AnyAction) => {
  const tmpState = appReducer(state, action);
  if (action.type === setPassword.type) {
    return {
      ...tmpState,
      [LSKeys.PASSWORD]: action.payload
    };
  } else if (action.type === resetState.type) {
    // Allow each slice to use their default state by passing undefined.
    // stackoverflow.com/questions/59061161/how-to-reset-state-of-redux-store-when-using-configurestore-from-reduxjs-toolki/61943631#61943631
    return combinedReducers(undefined, action);
  } else if (action.type === setStoreState.type) {
    // Optimistically consider that the provided payload is a valid state.
    return combinedReducers({ ...action.payload, ...tmpState }, action);
  } else {
    return combinedReducers(state, action);
  }
};

export default rootReducer;
