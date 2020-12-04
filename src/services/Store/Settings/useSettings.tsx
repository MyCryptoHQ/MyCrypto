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
  useDispatch
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
  updateSettings(settings: ISettings): void;
  updateSettingsAccounts(accounts: TUuid[]): void;
  updateSettingsNode(nodeId: string): void;
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

  const language = settings.language || '';

  const updateSettings = (settings: ISettings) => model.updateAll(settings);

  const exportStorage = () => JSON.stringify(model.exportStorage());

  const importStorage = (toImport: string): boolean => {
    const ls = exportStorage();
    if (!isValidImportFunc(toImport, String(ls))) return false;

    model.importStorage(toImport);
    return true;
  };

  // Solved
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

  // Todo
  const updateSettingsNode = (nodeId: string) => {
    updateSettings({ ...settings, node: nodeId });
  };

  const isValidImport = (toValidate: string) => isValidImportFunc(toValidate, exportStorage());

  return {
    settings,
    language,
    addAccountToFavorites,
    addMultipleAccountsToFavorites,
    addAssetToExclusionList,
    removeAssetfromExclusionList,
    updateSettings,
    updateSettingsAccounts,
    updateSettingsNode,
    exportStorage,
    importStorage,
    updateSettingsRates,
    updateLanguageSelection,
    updateFiatCurrency,
    isValidImport
  };
}

export default useSettings;
