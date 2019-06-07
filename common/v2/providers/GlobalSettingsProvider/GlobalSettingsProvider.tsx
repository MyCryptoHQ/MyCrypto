import React, { Component, createContext } from 'react';
import * as service from 'v2/services/GlobalSettings/GlobalSettings';
import { GlobalSettings } from 'v2/services/GlobalSettings';

import deepKeys from 'deep-keys';

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
      if (this.isValidImport(importedCache)) {
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

  private isValidImport(importedCache: string) {
    // https://www.npmjs.com/package/deep-keys
    // perform deep key compairison.
    const parsedImport = JSON.parse(importedCache);
    const localStorage = this.state.getStorage();
    if (deepKeys(parsedImport) === deepKeys(localStorage)) {
      return true;
    }
    return false;
  }
  private getGlobalSettings = () => {
    const globalSettings: GlobalSettings = service.readGlobalSettings() || [];
    this.setState({ globalSettings });
  };
}
