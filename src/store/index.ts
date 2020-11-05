import { TypedUseSelectorHook, useDispatch, useSelector as useReduxSelector } from 'react-redux';

import { RootState } from './reducer';
import { actions as settingsActions } from './settings';
import { default as store } from './store';

/* Store models */

/**
 * Type-safe version of the `react-redux` useSelector hook.
 */
const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;

export { useSelector, useDispatch, store };

export const {
  setLanguage,
  setCurrency,
  setInactivityTimer,
  setNode,
  addFavoriteAccount,
  addFavoriteAccounts,
  setFavoriteAccounts,
  updateRates,
  removeFavoriteAccount,
  addExludedAsset,
  removeExcludedAsset
} = settingsActions;
export {
  createUserAction,
  destroyUserAction,
  updateUserAction,
  updateUserActions
} from './userActions.slice';
export {
  createNotification,
  destroyNotification,
  updateNotification,
  updateNotifications
} from './notifications.slice';
export * from './entities';

export * from './selectors';
export * from './actions';
