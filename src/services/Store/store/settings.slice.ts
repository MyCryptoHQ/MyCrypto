import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { put, select, takeLatest } from 'redux-saga/effects';

import { LSKeys, TFiatTicker, TUuid } from '@types';
import { equals, findIndex } from '@vendor';

import { initialLegacyState } from './legacy.initialState';
import { getAppState } from './selectors';

const sliceName = LSKeys.SETTINGS;
export const initialState = initialLegacyState[sliceName];

// @todo: Get rates out of settings
const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    addDefault(state, action: PayloadAction<TUuid>) {
      state.dashboardAccounts.push(action.payload);
    },
    addDefaults(state, action: PayloadAction<TUuid[]>) {
      state.dashboardAccounts = [...state.dashboardAccounts, ...action.payload];
    },
    resetDefaultsTo(state, action: PayloadAction<TUuid[]>) {
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
    setDemoMode(state, action: PayloadAction<boolean>) {
      state.isDemoMode = action.payload;
    },
    setProductAnalyticsAuthorisation(state, action: PayloadAction<boolean>) {
      state.canTrackProductAnalytics = action.payload;
    }
  }
});

export const {
  addDefault,
  addDefaults,
  resetDefaultsTo,
  setLanguage,
  setFiat,
  addExcludedAsset,
  removeExcludedAsset,
  setDemoMode,
  setProductAnalyticsAuthorisation
} = slice.actions;

export default slice;

/**
 * Selectors
 */
export const getSettings = createSelector(getAppState, (s) => s[slice.name]);
export const getDefaults = createSelector(getSettings, (s) => s.dashboardAccounts);
export const getLanguage = createSelector(getSettings, (s) => s.language);
export const getFiat = createSelector(getSettings, (s) => s.fiatCurrency);
export const getExcludedAssets = createSelector(getSettings, (s) => s.excludedAssets);
export const getIsDemoMode = createSelector(getSettings, (s) => s.isDemoMode);
export const canTrackProductAnalytics = createSelector(
  getSettings,
  (s) => s.canTrackProductAnalytics
);
/**
 * Actions
 */
export const addAccountsToDefaults = createAction<TUuid[]>(`${slice.name}/addAccountsToDefaults`);

/**
 * Sagas
 */
export function* settingsSaga() {
  yield takeLatest(addAccountsToDefaults.type, handleAddAccountsToDefaults);
}

export function* handleAddAccountsToDefaults({ payload }: PayloadAction<TUuid[]>) {
  const isDemoMode = yield select(getIsDemoMode);
  if (isDemoMode) {
    yield put(slice.actions.setDemoMode(false));
    yield put(slice.actions.resetDefaultsTo(payload));
  } else {
    yield put(slice.actions.addDefaults(payload));
  }
}
