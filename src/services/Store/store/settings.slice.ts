import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IRates, LSKeys, TFiatTicker, TUuid } from '@types';
import { equals, findIndex } from '@vendor';

import { initialLegacyState } from './legacy.initialState';

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
    setInacticityTimer(state, action: PayloadAction<number>) {
      state.inactivityTimer = action.payload;
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
  setInacticityTimer
} = slice.actions;

export default slice;

/**
 * Selectors
 */

export const getFavorites = (s) => s.dashboardAccounts;
export const getLanguage = (s) => s.language;
export const getFiat = (s) => s.fiatCurrency;
export const getExcludedAssets = (s) => s.excludedAssets;
export const getRates = (s) => s.rates;
export const getInactivityTimer = (s) => s.inactivityTimer;

/**
 * Sagas
 */
