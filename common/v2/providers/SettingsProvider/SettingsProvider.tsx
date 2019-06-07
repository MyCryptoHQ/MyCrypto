import React, { Component, createContext } from 'react';
import * as service from 'v2/services/Settings/Settings';
import { Settings, updateSetting, readAllSettings } from 'v2/services/Settings';

interface ProviderState {
  settings: Settings;
  updateSettings(settingsData: Settings): void;
  updateSettingsAccounts(accounts: string[]): void;
  readAllSettings(): void;
}

export const SettingsContext = createContext({} as ProviderState);

export class SettingsProvider extends Component {
  public readonly state: ProviderState = {
    settings: service.readAllSettings() || {},
    updateSettings: (settingsData: Settings): void => {
      service.updateSetting(settingsData);
      this.getSettings();
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
  private getSettings = () => {
    const settings: Settings = service.readAllSettings() || [];
    this.setState({ settings });
  };
}
