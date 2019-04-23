import React, { Component, createContext } from 'react';
import * as service from 'v2/services/GlobalSettings/GlobalSettings';
import { GlobalSettings } from 'v2/services/GlobalSettings';

interface ProviderState {
  globalSettings: GlobalSettings;
  updateGlobalSettings(globalSettingsData: GlobalSettings): void;
  readGlobalSettings(): void;
}

export const GlobalSettingsContext = createContext({} as ProviderState);

export class GlobalSettingsProvider extends Component {
  public readonly state: ProviderState = {
    globalSettings: service.readGlobalSettings() || [],
    updateGlobalSettings: (globalSettingsData: GlobalSettings) => {
      service.updateGlobalSettings(globalSettingsData);
      this.getGlobalSettings();
    },
    readGlobalSettings: () => {
      service.readGlobalSettings();
      this.getGlobalSettings();
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
}
