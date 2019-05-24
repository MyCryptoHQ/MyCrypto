import React, { Component, createContext } from 'react';
import * as service from 'v2/services/GlobalSettings/GlobalSettings';
import { GlobalSettings } from 'v2/services/GlobalSettings';

interface ProviderState {
  globalSettings: GlobalSettings;
  localCache: string;
  updateGlobalSettings(globalSettingsData: GlobalSettings): void;
  readGlobalSettings(): void;
  readCache(): void;
  importCache(importedCache: string): void;
}

export const GlobalSettingsContext = createContext({} as ProviderState);

export class GlobalSettingsProvider extends Component {
  public readonly state: ProviderState = {
    localCache: service.readCache() || '[]',
    globalSettings: service.readGlobalSettings() || [],
    updateGlobalSettings: (globalSettingsData: GlobalSettings) => {
      service.updateGlobalSettings(globalSettingsData);
      this.getGlobalSettings();
      this.getCache();
    },
    readGlobalSettings: () => {
      service.readGlobalSettings();
      this.getGlobalSettings();
      this.getCache();
    },
    readCache: () => {
      this.getCache();
    },
    importCache: (importedCache: string) => {
      service.importCache(importedCache);
      this.getGlobalSettings();
      this.getCache();
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

  private getCache = () => {
    const localCache: String = service.readCache() || '[]';
    this.setState({ localCache });
  };
}
