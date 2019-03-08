import React, { Component, createContext } from 'react';
import AssetOptionsServiceBase from 'v2/services/AssetOption/AssetOption';
import { AssetOption, ExtendedAssetOption } from 'v2/services/AssetOption';

interface ProviderState {
  AssetOptions: ExtendedAssetOption[];
  createAssetOptions(AssetOptionsData: AssetOption): void;
  deleteAssetOptions(uuid: string): void;
  updateAssetOptions(uuid: string, AssetOptionsData: AssetOption): void;
}

export const AssetOptionsContext = createContext({} as ProviderState);

const AssetOption = new AssetOptionsServiceBase();

export class AssetOptionsProvider extends Component {
  public readonly state: ProviderState = {
    AssetOptions: AssetOption.readAssetOptions() || [],
    createAssetOptions: (AssetOptionsData: AssetOption) => {
      AssetOption.createAssetOption(AssetOptionsData);
      this.getAssetOptions();
    },
    deleteAssetOptions: (uuid: string) => {
      AssetOption.deleteAssetOption(uuid);
      this.getAssetOptions();
    },
    updateAssetOptions: (uuid: string, AssetOptionsData: AssetOption) => {
      AssetOption.updateAssetOption(uuid, AssetOptionsData);
      this.getAssetOptions();
    }
  };

  public render() {
    const { children } = this.props;
    return (
      <AssetOptionsContext.Provider value={this.state}>{children}</AssetOptionsContext.Provider>
    );
  }

  private getAssetOptions = () => {
    const AssetOptions: ExtendedAssetOption[] = AssetOption.readAssetOptions() || [];
    this.setState({ AssetOptions });
  };
}
