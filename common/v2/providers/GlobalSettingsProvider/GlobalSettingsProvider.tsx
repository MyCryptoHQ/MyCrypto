import React, { Component, createContext } from 'react';
import * as service from 'v2/services/GlobalSettings/GlobalSettings';
import { GlobalSettings } from 'v2/services/GlobalSettings';

interface ProviderState {
  globalSettings: GlobalSettings;
  localStorage: string;
  updateGlobalSettings(globalSettingsData: GlobalSettings): void;
  readGlobalSettings(): void;
  getStorage(): void;
  importCache(importedCache: string): void;
}

export const GlobalSettingsContext = createContext({} as ProviderState);

export class GlobalSettingsProvider extends Component {
  public readonly state: ProviderState = {
    localStorage: service.readStorage() || '[]',
    globalSettings: service.readGlobalSettings() || [],
    updateGlobalSettings: (globalSettingsData: GlobalSettings) => {
      service.updateGlobalSettings(globalSettingsData);
      this.getGlobalSettings();
      this.syncStorage();
    },
    readGlobalSettings: () => {
      service.readGlobalSettings();
      this.getGlobalSettings();
      this.syncStorage();
    },
    getStorage: () => {
      return service.readStorage();
    },
    importCache: (importedCache: string) => {
      service.importCache(importedCache);
      this.getGlobalSettings();
      this.syncStorage();
    }
  };

  public render() {
    const { children } = this.props;
    return (
      <GlobalSettingsContext.Provider value={this.state}>{children}</GlobalSettingsContext.Provider>
    );
  }
  private getGlobalSettings = () => {
    const globalSettings: GlobalSettings = service.readGlobalSettings() || [];
    this.setState({ globalSettings });
  };

  private syncStorage = () => {
    const localStorage: string = service.readStorage() || '[]';
    this.setState({ localStorage });
  };
}
