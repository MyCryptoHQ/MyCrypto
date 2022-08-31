import { combineReducers } from '@reduxjs/toolkit';
import { REHYDRATE } from 'redux-persist';
import { all, put, takeLatest } from 'redux-saga/effects';

import { trackInit } from '@services';

import accountSlice, { startBalancesPolling, startTxPolling } from './account.slice';
import assetSlice, { fetchAssets } from './asset.slice';
import claimsSlice, { fetchClaims } from './claims.slice';
import connectionsSlice from './connections.slice';
import contactSlice from './contact.slice';
import contractSlice from './contract.slice';
import { fetchENS } from './ens.slice';
import { startGasPolling } from './gas.slice';
import { initialLegacyState } from './legacy.initialState';
import { fetchMemberships } from './membership.slice';
import networkSlice from './network.slice';
import notificationSlice from './notification.slice';
import { APP_PERSIST_CONFIG } from './persist.config';
import promoPoapsSlice, { checkForPromos } from './promoPoaps.slice';
import ratesSlice, { startRatesPolling } from './rates.slice';
import settingsSlice from './settings.slice';
import trackedAssetsSlice from './trackedAssets.slice';
import { fetchHistory, fetchSchemaMeta } from './txHistory.slice';
import userActionSlice from './userAction.slice';

interface IRehydrate {
  key: typeof APP_PERSIST_CONFIG.key;
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
  [promoPoapsSlice.name]: promoPoapsSlice.reducer,
  [connectionsSlice.name]: connectionsSlice.reducer,
  [claimsSlice.name]: claimsSlice.reducer
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
    yield put(fetchAssets());
    yield put(fetchSchemaMeta());
    yield put(fetchMemberships());
    yield put(startRatesPolling());
    yield put(fetchHistory());
    yield put(startTxPolling());
    yield put(startBalancesPolling());
    yield put(fetchENS());
    yield put(fetchClaims());
    yield put(startGasPolling());
    yield put(checkForPromos());
  }
}
