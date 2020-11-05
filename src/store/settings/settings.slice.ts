import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { LanguageCode } from '@config';
import { defaultSettings } from '@database/data/settings';
import { IRates, ISettings, LSKeys, TFiatTicker, TUuid } from '@types';
import { uniq, without } from '@vendor';

export const initialState: ISettings = defaultSettings;

const slice = createSlice({
  name: LSKeys.ACCOUNTS,
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<LanguageCode>) {
      state.language = action.payload;
    },
    setCurrency(state, action: PayloadAction<TFiatTicker>) {
      state.fiatCurrency = action.payload;
    },
    setInactivityTimer(state, action: PayloadAction<number>) {
      state.inactivityTimer = action.payload;
    },
    setNode(state, action: PayloadAction<string>) {
      state.node = action.payload;
    },
    updateRates(state, action: PayloadAction<IRates>) {
      state.rates = { ...state.rates, ...action.payload };
    },
    setFavoriteAccounts(state, action: PayloadAction<TUuid[]>) {
      state.dashboardAccounts = uniq(action.payload);
    },
    addFavoriteAccount(state, action: PayloadAction<TUuid>) {
      state.dashboardAccounts = uniq([...state.dashboardAccounts, action.payload]);
    },
    addFavoriteAccounts(state, action: PayloadAction<TUuid[]>) {
      state.dashboardAccounts = uniq([...state.dashboardAccounts, ...action.payload]);
    },
    removeFavoriteAccount(state, action: PayloadAction<TUuid>) {
      state.dashboardAccounts = without([action.payload], state.dashboardAccounts);
    },
    addExludedAsset(state, action: PayloadAction<TUuid>) {
      state.excludedAssets = uniq([...state.excludedAssets, action.payload]);
    },
    removeExcludedAsset(state, action: PayloadAction<TUuid>) {
      state.excludedAssets = without([action.payload], state.excludedAssets);
    },
    reset() {
      return initialState;
    }
  }
});

export default slice;
