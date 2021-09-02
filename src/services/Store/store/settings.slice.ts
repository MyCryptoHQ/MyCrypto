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
    addCurrent(state, action: PayloadAction<TUuid>) {
      state.dashboardAccounts.push(action.payload);
    },
    addCurrents(state, action: PayloadAction<TUuid[]>) {
      state.dashboardAccounts = [...state.dashboardAccounts, ...action.payload];
    },
    resetCurrentsTo(state, action: PayloadAction<TUuid[]>) {
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
    },
    setAnalyticsUserID(state, action: PayloadAction<string>) {
      state.analyticsUserID = action.payload;
    }
  }
});

export const {
  addCurrent,
  addCurrents,
  resetCurrentsTo,
  setLanguage,
  setFiat,
  addExcludedAsset,
  removeExcludedAsset,
  setDemoMode,
  setProductAnalyticsAuthorisation,
  setAnalyticsUserID
} = slice.actions;

export default slice;

/**
 * Selectors
 */
export const getSettings = createSelector(getAppState, (s) => s.settings);
export const getCurrents = createSelector(getSettings, (s) => s.dashboardAccounts);
export const getLanguage = createSelector(getSettings, (s) => s.language);
export const getFiat = createSelector(getSettings, (s) => s.fiatCurrency);
export const getExcludedAssets = createSelector(getSettings, (s) => s.excludedAssets);
export const getIsDemoMode = createSelector(getSettings, (s) => s.isDemoMode);
export const canTrackProductAnalytics = createSelector(
  getSettings,
  (s) => s.canTrackProductAnalytics
);
export const getAnalyticsUserID = createSelector(getSettings, (s) => s.analyticsUserID);
/**
 * Actions
 */
export const addAccountsToCurrents = createAction<TUuid[]>(`${slice.name}/addAccountsToCurrents`);

/**
 * Sagas
 */
export function* settingsSaga() {
  yield takeLatest(addAccountsToCurrents.type, handleAddAccountsToCurrents);
}

export function* handleAddAccountsToCurrents({ payload }: PayloadAction<TUuid[]>) {
  const isDemoMode = yield select(getIsDemoMode);
  if (isDemoMode) {
    yield put(slice.actions.setDemoMode(false));
    yield put(slice.actions.resetCurrentsTo(payload));
  } else {
    yield put(slice.actions.addCurrents(payload));
  }
}
