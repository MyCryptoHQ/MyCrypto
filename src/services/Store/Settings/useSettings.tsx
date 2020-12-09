import { useContext } from 'react';

import {
  addExcludedAsset,
  addFavorite,
  addFavorites,
  exportState,
  importState,
  removeExcludedAsset,
  resetFavoritesTo,
  setFiat,
  setLanguage,
  setRates,
  useDispatch,
  useSelector
} from '@store';

import { IRates, ISettings, LSKeys, TFiatTicker, TUuid } from '@types';

import { DataContext } from '../DataManager';

export interface ISettingsContext {
  settings: ISettings;
  language: string;
  addAccountToFavorites(uuid: TUuid): void;
  addMultipleAccountsToFavorites(uuids: TUuid[]): void;
  addAssetToExclusionList(uuid: TUuid): void;
  removeAssetfromExclusionList(uuid: TUuid): void;
  updateSettingsAccounts(accounts: TUuid[]): void;
  exportStorage(): string;
  importStorage(importedCache: string): boolean;
  updateSettingsRates(rates: IRates): void;
  updateLanguageSelection(language: string): void;
  updateFiatCurrency(fiatTicker: TFiatTicker): void;
  isValidImport(toValidate: string): boolean;
}

const isValidImportFunc = (importedCache: string, localStorage: string) => {
  try {
    const parsedImport = JSON.parse(importedCache);
    const parsedLocalStorage = JSON.parse(localStorage);

    // @todo: Do migration instead of failing
    if (parsedImport.version !== parsedLocalStorage.version) {
      throw new Error(
        `Outdated version detected. Cannot import ${parsedImport.version} into ${parsedLocalStorage.version}`
      );
    }

    const oldKeys = Object.keys(parsedImport);
    const newKeys = Object.keys(parsedLocalStorage);
    return oldKeys.every((key) => newKeys.includes(key));
  } catch (error) {
    console.debug(error);
    return false;
  }
};

function useSettings() {
  const { createActions, settings } = useContext(DataContext);
  const dispatch = useDispatch();
  const model = createActions(LSKeys.SETTINGS);
  const appState = useSelector(exportState);
  const language = settings.language || '';

  const isValidImport = (toValidate: string) => isValidImportFunc(toValidate, appState);

  const importStorage = (toImport: string): boolean => {
    const ls = appState;
    if (!isValidImportFunc(toImport, String(ls))) return false;

    model.importStorage(toImport);
    return true;
  };

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

  return {
    settings,
    language,
    addAccountToFavorites,
    addMultipleAccountsToFavorites,
    addAssetToExclusionList,
    removeAssetfromExclusionList,
    updateSettingsAccounts,
    exportStorage: exportState,
    importStorage: importState,
    updateSettingsRates,
    updateLanguageSelection,
    updateFiatCurrency,
    isValidImport
  };
}

export default useSettings;
