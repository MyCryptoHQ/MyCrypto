import React, { useContext, createContext } from 'react';

import { ISettings, IRates, LSKeys, TUuid } from 'v2/types';
import { DataContext } from '../DataManager';

export interface ISettingsContext {
  settings: ISettings;
  language: string;
  addAccountToFavorites(uuid: TUuid): void;
  updateSettings(settings: ISettings): void;
  updateSettingsAccounts(accounts: TUuid[]): void;
  updateSettingsNode(nodeId: string): void;
  exportStorage(): string;
  importStorage(importedCache: string): boolean;
  updateSettingsRates(rates: IRates): void;
  updateLanguageSelection(language: string): void;
}

const isValidImport = (importedCache: string, localStorage: string) => {
  try {
    const parsedImport = JSON.parse(importedCache);
    const parsedLocalStorage = JSON.parse(localStorage);

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

export const SettingsContext = createContext({} as ISettingsContext);

export const SettingsProvider: React.FC = ({ children }) => {
  const { createActions, settings } = useContext(DataContext);
  const model = createActions(LSKeys.SETTINGS);

  const state: ISettingsContext = {
    settings,
    language: settings.language || '',
    updateSettings: model.updateAll,
    exportStorage: () => JSON.stringify(model.exportStorage()),
    importStorage: (toImport: string): boolean => {
      const ls = state.exportStorage();
      if (!isValidImport(toImport, String(ls))) return false;

      model.importStorage(toImport);
      return true;
    },
    addAccountToFavorites: (account: TUuid): void => {
      state.updateSettings({
        ...settings,
        dashboardAccounts: [...settings.dashboardAccounts, account]
      });
    },
    updateSettingsAccounts: (accounts: TUuid[]): void => {
      state.updateSettings({ ...settings, dashboardAccounts: accounts });
    },

    updateSettingsNode: (nodeId: string): void => {
      state.updateSettings({ ...settings, node: nodeId });
    },

    updateSettingsRates: (rates) => {
      state.updateSettings({ ...settings, rates });
    },
    updateLanguageSelection: (languageToChangeTo) => {
      state.updateSettings({ ...settings, language: languageToChangeTo });
    }
  };

  return <SettingsContext.Provider value={state}>{children}</SettingsContext.Provider>;
};
