import React, { Component, createContext } from 'react';
import * as service from 'v2/services/GlobalSettings/GlobalSettings';
import { GlobalSettings } from 'v2/services/GlobalSettings';

interface ProviderState {
  globalSettings: GlobalSettings;
  updateGlobalSettings(globalSettingsData: GlobalSettings): void;
  getStorage(): void;
  importCache(importedCache: string): void;
}

export const GlobalSettingsContext = createContext({} as ProviderState);

export class GlobalSettingsProvider extends Component {
  public readonly state: ProviderState = {
    globalSettings: service.readGlobalSettings() || [],
    updateGlobalSettings: (globalSettings: GlobalSettings) => {
      this.setState(
        // Update our state to let react trigger changes.
        {
          globalSettings
        },
        // Save to localStorage
        () => service.updateGlobalSettings(this.state.globalSettings)
      );
    },

    getStorage: () => {
      return service.readStorage();
    },
    importCache: (importedCache: string) => {
      const localStorage = this.state.getStorage();
      if (this.isValidImport(importedCache, String(localStorage))) {
        service.importCache(importedCache);
        this.getGlobalSettings();
        // We're missing a service method to update all the components.
        // While waiting we can just trigger a page refresh from Settings when this returns true.
        return true;
      }
      return false;
    }
  };

  public render() {
    const { children } = this.props;
    return (
      <GlobalSettingsContext.Provider value={this.state}>{children}</GlobalSettingsContext.Provider>
    );
  }

  private isValidImport(importedCache: string, localStorage: string) {
    const parsedImport = JSON.parse(importedCache);
    const parsedLocalStorage = JSON.parse(localStorage);

    const oldKeys = Object.keys(parsedImport).sort();
    const newKeys = Object.keys(parsedLocalStorage).sort();
    return JSON.stringify(oldKeys) === JSON.stringify(newKeys);
  }
  private getGlobalSettings = () => {
    const globalSettings: GlobalSettings = service.readGlobalSettings() || [];
    this.setState({ globalSettings });
  };
}
