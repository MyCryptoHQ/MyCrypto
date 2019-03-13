import React, { Component, createContext } from 'react';
import GlobalSettingsServiceBase from 'v2/services/GlobalSettings/GlobalSettings';
import { GlobalSettings } from 'v2/services/GlobalSettings';

interface ProviderState {
  globalSettings: GlobalSettings;
  updateGlobalSettings(GlobalSettingsData: GlobalSettings): void;
}

export const GlobalSettingsContext = createContext({} as ProviderState);

const GlobalSettings = new GlobalSettingsServiceBase();

export class GlobalSettingsProvider extends Component {
  public readonly state: ProviderState = {
    globalSettings: GlobalSettings.readGlobalSettings() || [],
    updateGlobalSettings: (globalSettingsData: GlobalSettings) => {
      GlobalSettings.updateGlobalSettings(globalSettingsData);
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
    const globalSettings: GlobalSettings = GlobalSettings.readGlobalSettings() || [];
    this.setState({ globalSettings });
  };
}
