import { TypedUseSelectorHook, useDispatch, useSelector as useReduxSelector } from 'react-redux';

import { AppState } from './root.reducer';
import { actions as settingsActions } from './settings';

/**
 * Type-safe version of the `react-redux` useSelector hook.
 */
const useSelector: TypedUseSelectorHook<AppState> = useReduxSelector;

export { useSelector, useDispatch, AppState };
export { resetState, setStoreState } from './root.reducer';
export { default as store, persistor, exportState } from './store';
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
export { setVault, destroyVault } from './vault.slice';
export * from './entities';

export * from './selectors';
export { default as useAppStore } from './useAppStore';
export { importState, setPassword } from './app.reducer';
