import { combineReducers } from '@reduxjs/toolkit';
import { REHYDRATE } from 'redux-persist';
import { all, put, takeLatest } from 'redux-saga/effects';

import { trackInit } from '@services';

import accountSlice from './account.slice';
import assetSlice from './asset.slice';
import contactSlice from './contact.slice';
import contractSlice from './contract.slice';
import { initialLegacyState } from './legacy.initialState';
import networkSlice from './network.slice';
import notificationSlice from './notification.slice';
import passwordSlice from './password.slice';
import { APP_PERSIST_CONFIG, VAULT_PERSIST_CONFIG } from './persist.config';
import ratesSlice, { startRatesPolling } from './rates.slice';
import settingsSlice from './settings.slice';
import trackedAssetsSlice from './trackedAssets.slice';
import userActionSlice from './userAction.slice';

interface IRehydrate {
  key: typeof APP_PERSIST_CONFIG.key | typeof VAULT_PERSIST_CONFIG.key;
  type: typeof REHYDRATE;
}

const persistenceReducer = combineReducers({
  version: () => initialLegacyState.version,
  [accountSlice.name]: accountSlice.reducer,
  [assetSlice.name]: assetSlice.reducer,
  [ratesSlice.name]: ratesSlice.reducer,
  [trackedAssetsSlice.name]: trackedAssetsSlice.reducer,
  [contactSlice.name]: contactSlice.reducer,
  [contractSlice.name]: contractSlice.reducer,
  [networkSlice.name]: networkSlice.reducer,
  [notificationSlice.name]: notificationSlice.reducer,
  [settingsSlice.name]: settingsSlice.reducer,
  [userActionSlice.name]: userActionSlice.reducer,
  [passwordSlice.name]: passwordSlice.reducer
});

const slice = {
  reducer: persistenceReducer,
  name: 'database'
};

export default slice;

/**
 * Saga
 */
export function* persistenceSaga() {
  yield all([yield takeLatest(REHYDRATE, handleRehydrateSuccess)]);
}

function* handleRehydrateSuccess(action: IRehydrate) {
  if (action.key === APP_PERSIST_CONFIG.key) {
    yield put(trackInit());
    yield put(startRatesPolling());
  }
}
