import React, { Component, createContext } from 'react';
import * as service from 'v2/services/LocalSettings/LocalSettings';
import { LocalSetting, ExtendedLocalSetting } from 'v2/services/LocalSettings';

interface ProviderState {
  localSettings: ExtendedLocalSetting[];
  createLocalSetting(localSettingData: LocalSetting): void;
  readLocalSetting(uuid: string): LocalSetting;
  deleteLocalSetting(uuid: string): void;
  updateLocalSetting(uuid: string, LocalSettingData: LocalSetting): void;
}

export const LocalSettingsContext = createContext({} as ProviderState);

export class LocalSettingProvider extends Component {
  public readonly state: ProviderState = {
    localSettings: service.readLocalSettings() || [],
    createLocalSetting: (localSettingData: LocalSetting) => {
      service.createLocalSetting(localSettingData);
      this.getLocalSettings();
    },
    readLocalSetting: (uuid: string): LocalSetting => {
      return service.readLocalSetting(uuid);
    },
    deleteLocalSetting: (uuid: string) => {
      service.deleteLocalSetting(uuid);
      this.getLocalSettings();
    },
    updateLocalSetting: (uuid: string, localSettingData: LocalSetting) => {
      service.updateLocalSetting(uuid, localSettingData);
      this.getLocalSettings();
    }
  };

  public render() {
    const { children } = this.props;
    return (
      <LocalSettingsContext.Provider value={this.state}>{children}</LocalSettingsContext.Provider>
    );
  }

  private getLocalSettings = () => {
    const localSettings: ExtendedLocalSetting[] = service.readLocalSettings() || [];
    this.setState({ localSettings });
  };
}
