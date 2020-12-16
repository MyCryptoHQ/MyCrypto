import { useContext } from 'react';

import {
  addExcludedAsset,
  addFavorite,
  addFavorites,
  removeExcludedAsset,
  resetFavoritesTo,
  setFiat,
  setLanguage,
  setRates,
  toggleDemoMode,
  useDispatch
} from '@store';
import { IRates, ISettings, TFiatTicker, TUuid } from '@types';

import { DataContext } from '../DataManager';

export interface ISettingsContext {
  settings: ISettings;
  language: string;
  addAccountToFavorites(uuid: TUuid): void;
  addMultipleAccountsToFavorites(uuids: TUuid[]): void;
  addAssetToExclusionList(uuid: TUuid): void;
  removeAssetfromExclusionList(uuid: TUuid): void;
  updateSettingsAccounts(accounts: TUuid[]): void;
  updateSettingsRates(rates: IRates): void;
  updateLanguageSelection(language: string): void;
  updateFiatCurrency(fiatTicker: TFiatTicker): void;
  toggleDemoMode(isDemoMode: boolean): void;
}

function useSettings() {
  const { settings } = useContext(DataContext);
  const dispatch = useDispatch();
  const language = settings.language || '';

  const addAccountToFavorites = (account: TUuid) => {
    dispatch(addFavorite(account));
  };

  const addMultipleAccountsToFavorites = (accounts: TUuid[]) => {
    dispatch(addFavorites(accounts));
  };

  const updateSettingsAccounts = (accounts: TUuid[]) => {
    dispatch(resetFavoritesTo(accounts));
  };

  const updateLanguageSelection = (lang: string) => {
    dispatch(setLanguage(lang));
  };

  const updateFiatCurrency = (fiat: TFiatTicker) => {
    dispatch(setFiat(fiat));
  };

  const addAssetToExclusionList = (assetUuid: TUuid): void => {
    dispatch(addExcludedAsset(assetUuid));
  };

  const removeAssetfromExclusionList = (assetUuid: TUuid): void => {
    dispatch(removeExcludedAsset(assetUuid));
  };

  const updateSettingsRates = (rates: IRates) => {
    dispatch(setRates(rates));
  };

  const toggleDemo = (isDemoMode: boolean) => {
    dispatch(toggleDemoMode(isDemoMode));
  };

  return {
    settings,
    language,
    addAccountToFavorites,
    addMultipleAccountsToFavorites,
    addAssetToExclusionList,
    removeAssetfromExclusionList,
    updateSettingsAccounts,
    updateSettingsRates,
    updateLanguageSelection,
    updateFiatCurrency,
    toggleDemo
  };
}

export default useSettings;
