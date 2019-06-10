import React, { Component, createContext } from 'react';
import * as service from 'v2/services/Settings/Settings';
import {
  Settings,
  updateSetting,
  readAllSettings,
  readStorage,
  importStorage
} from 'v2/services/Settings';

interface ProviderState {
  settings: Settings;
  updateSettings(settingsData: Settings): void;
  updateSettingsAccounts(accounts: string[]): void;
  readAllSettings(): void;
  getStorage(): void;
  importStorage(importedCache: string): void;
}

export const SettingsContext = createContext({} as ProviderState);

export class SettingsProvider extends Component {
  public readonly state: ProviderState = {
    settings: readAllSettings() || {},
    updateSettings: (settings: Settings): void => {
      this.setState(
        // Update our state to let react trigger changes.
        {
          settings
        },
        // Save to localStorage
        () => updateSetting(this.state.settings)
      );
    },
    getStorage: () => {
      return readStorage();
    },
    importStorage: (importedCache: string) => {
      const localStorage = this.state.getStorage();
      if (this.isValidImport(importedCache, String(localStorage))) {
        importStorage(importedCache);
        this.getSettings();
        // We're missing a service method to update all the components.
        // While waiting we can just trigger a page refresh from Settings when this returns true.
        return true;
      }
      return false;
    },
    updateSettingsAccounts: (accounts: string[]): void => {
      const settings = readAllSettings();
      updateSetting({ ...settings, dashboardAccounts: accounts });
      this.getSettings();
    },
    readAllSettings: () => {
      service.readAllSettings();
      this.getSettings();
    }
  };

  public render() {
    const { children } = this.props;
    return <SettingsContext.Provider value={this.state}>{children}</SettingsContext.Provider>;
  }
  private isValidImport(importedCache: string, localStorage: string) {
    const parsedImport = JSON.parse(importedCache);
    const parsedLocalStorage = JSON.parse(localStorage);

    const oldKeys = Object.keys(parsedImport).sort();
    const newKeys = Object.keys(parsedLocalStorage).sort();
    return JSON.stringify(oldKeys) === JSON.stringify(newKeys);
  }
  private getSettings = () => {
    const settings: Settings = readAllSettings() || [];
    this.setState({ settings });
  };
}
