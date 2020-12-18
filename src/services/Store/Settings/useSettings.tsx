import { useContext } from 'react';

import {
  addExcludedAsset,
  removeExcludedAsset,
  resetFavoritesTo,
  setDemoMode,
  setFiat,
  setLanguage,
  setRates,
  useDispatch
} from '@store';
import { addAccountsToFavorites } from '@store/settings.slice';
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
  setDemoMode(isDemoMode: boolean): void;
}

function useSettings() {
  const { settings } = useContext(DataContext);
  const dispatch = useDispatch();
  const language = settings.language || '';

  const addAccountToFavorites = (account: TUuid) => {
    dispatch(addAccountsToFavorites([account]));
  };

  const addMultipleAccountsToFavorites = (accounts: TUuid[]) => {
    dispatch(addAccountsToFavorites(accounts));
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

  const setDemo = (isDemoMode: boolean) => {
    dispatch(setDemoMode(isDemoMode));
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
    setDemo
  };
}

export default useSettings;
