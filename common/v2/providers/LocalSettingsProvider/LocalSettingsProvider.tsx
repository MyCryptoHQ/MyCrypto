import React, { Component, createContext } from 'react';
import LocalSettingsServiceBase from 'v2/services/LocalSettings/LocalSettings';
import { LocalSetting, ExtendedLocalSetting } from 'v2/services/LocalSettings';

interface State {
  LocalSettings: ExtendedLocalSetting[];
  createLocalSetting(LocalSettingData: LocalSetting): void;
  deleteLocalSetting(uuid: string): void;
  updateLocalSetting(uuid: string, LocalSettingData: LocalSetting): void;
}

export const LocalSettingsContext = createContext({
  LocalSettings: [],
  createLocalSetting: () => undefined,
  deleteLocalSetting: () => undefined,
  updateLocalSetting: () => undefined
});

const LocalSetting = new LocalSettingsServiceBase();

export class LocalSettingProvider extends Component {
  public state: State = {
    LocalSettings: LocalSetting.readLocalSettings() || [],
    createLocalSetting: (localSettingData: LocalSetting) => {
      LocalSetting.createLocalSetting(localSettingData);
      this.getLocalSettings();
    },
    deleteLocalSetting: (uuid: string) => {
      LocalSetting.deleteLocalSetting(uuid);
      this.getLocalSettings();
    },
    updateLocalSetting: (uuid: string, LocalSettingData: LocalSetting) => {
      LocalSetting.updateLocalSetting(uuid, LocalSettingData);
      this.getLocalSettings();
    }
  };
  constructor(props: any) {
    super(props);
    LocalSetting.init();
  }

  public render() {
    console.log(this.state.LocalSettings);
    const { children } = this.props;
    return (
      <LocalSettingsContext.Provider value={this.state}>{children}</LocalSettingsContext.Provider>
    );
  }

  private getLocalSettings = () => {
    const LocalSettings: ExtendedLocalSetting[] = LocalSetting.readLocalSettings() || [];
    this.setState({ LocalSettings });
  };
}
