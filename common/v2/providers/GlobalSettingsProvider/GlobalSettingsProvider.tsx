import React, { Component, createContext } from 'react';
import GlobalSettingsServiceBase from 'v2/services/GlobalSettings/GlobalSettings';
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

const GlobalSettings = new GlobalSettingsServiceBase();

export class GlobalSettingsProvider extends Component {
  public readonly state: ProviderState = {
    globalSettings: GlobalSettings.readGlobalSettings() || [],
    localCache: GlobalSettings.readCache() || '[]',
    updateGlobalSettings: (globalSettingsData: GlobalSettings) => {
      GlobalSettings.updateGlobalSettings(globalSettingsData);
      this.getGlobalSettings();
      this.getCache();
    },
    readGlobalSettings: () => {
      GlobalSettings.readGlobalSettings();
      this.getGlobalSettings();
      this.getCache();
    },
    readCache: () => {
      this.getCache();
    },
    importCache: (importedCache: string) => {
      GlobalSettings.importCache(importedCache);
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
    const globalSettings: GlobalSettings = GlobalSettings.readGlobalSettings() || [];
    this.setState({ globalSettings });
  };

  private getCache = () => {
    const localCache: String = GlobalSettings.readCache() || '[]';
    this.setState({ localCache });
  };
}
