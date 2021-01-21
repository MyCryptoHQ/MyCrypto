import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { put, select, takeLatest } from 'redux-saga/effects';

import { IRates, LSKeys, TFiatTicker, TUuid } from '@types';
import { equals, findIndex } from '@vendor';

import { initialLegacyState } from './legacy.initialState';
import { getAppState } from './selectors';

const sliceName = LSKeys.SETTINGS;
export const initialState = initialLegacyState[sliceName];

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    addFavorite(state, action: PayloadAction<TUuid>) {
      state.dashboardAccounts.push(action.payload);
    },
    addFavorites(state, action: PayloadAction<TUuid[]>) {
      state.dashboardAccounts = [...state.dashboardAccounts, ...action.payload];
    },
    resetFavoritesTo(state, action: PayloadAction<TUuid[]>) {
      state.dashboardAccounts = action.payload;
    },
    addExcludedAsset(state, action: PayloadAction<TUuid>) {
      state.excludedAssets.push(action.payload);
    },
    removeExcludedAsset(state, action: PayloadAction<TUuid>) {
      const idx = findIndex(equals(action.payload), state.excludedAssets);
      state.excludedAssets.splice(idx, 1);
    },
    setLanguage(state, action: PayloadAction<string>) {
      state.language = action.payload;
    },
    setFiat(state, action: PayloadAction<TFiatTicker>) {
      state.fiatCurrency = action.payload;
    },
    setRates(state, action: PayloadAction<IRates>) {
      state.rates = action.payload;
    },
    setInactivityTimer(state, action: PayloadAction<number>) {
      state.inactivityTimer = action.payload;
    },
    setDemoMode(state, action: PayloadAction<boolean>) {
      state.isDemoMode = action.payload;
    },
    setProductAnalyticsAuthorisation(state, action: PayloadAction<boolean>) {
      state.canTrackProductAnalytics = action.payload;
    }
  }
});

export const {
  addFavorite,
  addFavorites,
  resetFavoritesTo,
  setLanguage,
  setFiat,
  addExcludedAsset,
  removeExcludedAsset,
  setRates,
  setInactivityTimer,
  setDemoMode,
  setProductAnalyticsAuthorisation
} = slice.actions;

export default slice;

/**
 * Selectors
 */
export const getSettings = createSelector(getAppState, (s) => s[slice.name]);
export const getFavorites = createSelector(getSettings, (s) => s.dashboardAccounts);
export const getLanguage = createSelector(getSettings, (s) => s.language);
export const getFiat = createSelector(getSettings, (s) => s.fiatCurrency);
export const getExcludedAssets = createSelector(getSettings, (s) => s.excludedAssets);
export const getRates = createSelector(getSettings, (s) => s.rates);
export const getInactivityTimer = createSelector(getSettings, (s) => s.inactivityTimer);
export const getIsDemoMode = createSelector(getSettings, (s) => s.isDemoMode);
export const canTrackProductAnalytics = createSelector(
  getSettings,
  (s) => s.canTrackProductAnalytics
);
/**
 * Actions
 */
export const addAccountsToFavorites = createAction<TUuid[]>(`${slice.name}/addAccountsToFavorites`);

/**
 * Sagas
 */
export function* settingsSaga() {
  yield takeLatest(addAccountsToFavorites.type, handleAddAccountsToFavorites);
}

export function* handleAddAccountsToFavorites({ payload }: PayloadAction<TUuid[]>) {
  const isDemoMode = yield select(getIsDemoMode);
  if (isDemoMode) {
    yield put(slice.actions.setDemoMode(false));
    yield put(slice.actions.resetFavoritesTo(payload));
  } else {
    yield put(slice.actions.addFavorites(payload));
  }
}
