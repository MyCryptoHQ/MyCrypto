import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { put, select, takeLatest } from 'redux-saga/effects';

import { Fiats } from '@config';
import { RatesService } from '@services/ApiService/Rates';
import { IPollingPayload, pollStart } from '@services/Polling';
import { ExtendedAsset, IRates, LSKeys, TFiatTicker, TTicker, TUuid } from '@types';
import { equals, findIndex } from '@vendor';

import { addAssetsFromAPI, getAssets } from './asset.slice';
import { initialLegacyState } from './legacy.initialState';
import { getAppState } from './selectors';

const sliceName = LSKeys.SETTINGS;
export const initialState = initialLegacyState[sliceName];

// @todo: Get rates out of settings
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
export const startRatesPolling = createAction(`${slice.name}/startRatesPolling`);

/**
 * Sagas
 */
export function* settingsSaga() {
  yield takeLatest(addAccountsToFavorites.type, handleAddAccountsToFavorites);
  yield takeLatest(addAssetsFromAPI.type, pollRates);
  yield takeLatest(startRatesPolling, pollRates);
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

export function* pollRates() {
  const assets: ExtendedAsset[] = yield select(getAssets);

  const geckoIds = assets.reduce((acc, a) => {
    if (a.mappings && a.mappings.coinGeckoId) {
      acc.push(a.mappings.coinGeckoId);
    }
    return acc;
  }, [] as string[]);

  const destructureCoinGeckoIds = (rates: IRates, assets: ExtendedAsset[]): IRates => {
    // From: { ["ethereum"]: { "usd": 123.45,"eur": 234.56 } }
    // To: { [uuid for coinGeckoId "ethereum"]: { "usd": 123.45, "eur": 234.56 } }
    const updateRateObj = (acc: any, curValue: TTicker): IRates => {
      const asset = assets.find((a) => a.mappings && a.mappings.coinGeckoId === curValue);
      acc[asset!.uuid] = rates[curValue];
      return acc;
    };

    return Object.keys(rates).reduce(updateRateObj, {} as IRates);
  };

  const payload: IPollingPayload = {
    params: {
      interval: 9000
    },
    successAction: 'test/setRates',
    promise: () => RatesService.instance.fetchAssetsRates(geckoIds, Object.keys(Fiats)),
    transformer: (result: IRates) => destructureCoinGeckoIds(result, assets)
  };

  yield put(pollStart(payload));
}
