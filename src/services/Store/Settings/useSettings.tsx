import { useContext } from 'react';

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

  const addAccountToFavorites = (account: TUuid): void => {
    updateSettings({
      ...settings,
      dashboardAccounts: [...settings.dashboardAccounts, account]
    });
  };

  const addMultipleAccountsToFavorites = (accounts: TUuid[]): void => {
    updateSettings({
      ...settings,
      dashboardAccounts: [...settings.dashboardAccounts, ...accounts]
    });
  };

  const addAssetToExclusionList = (assetUuid: TUuid): void => {
    updateSettings({
      ...settings,
      excludedAssets: [...(settings.excludedAssets || []), assetUuid]
    });
  };

  const removeAssetfromExclusionList = (assetUuid: TUuid): void => {
    updateSettings({
      ...settings,
      excludedAssets: (settings.excludedAssets || []).filter((uuid) => uuid !== assetUuid)
    });
  };

  const updateSettingsAccounts = (accounts: TUuid[]): void => {
    updateSettings({ ...settings, dashboardAccounts: accounts });
  };

  const updateSettingsNode = (nodeId: string) => {
    updateSettings({ ...settings, node: nodeId });
  };

  const updateSettingsRates = (rates: IRates) => {
    updateSettings({ ...settings, rates });
  };

  const updateLanguageSelection = (languageToChangeTo: string) => {
    updateSettings({ ...settings, language: languageToChangeTo });
  };

  const updateFiatCurrency = (newFiatSelection: TFiatTicker) => {
    updateSettings({ ...settings, fiatCurrency: newFiatSelection });
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
