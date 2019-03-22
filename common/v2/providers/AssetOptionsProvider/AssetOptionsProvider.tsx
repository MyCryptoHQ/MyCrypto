import React, { Component, createContext } from 'react';
import AssetOptionsServiceBase from 'v2/services/AssetOption/AssetOption';
import { AssetOption, ExtendedAssetOption } from 'v2/services/AssetOption';

interface ProviderState {
  assetOptions: ExtendedAssetOption[];
  createAssetOptions(assetOptionsData: AssetOption): void;
  deleteAssetOptions(uuid: string): void;
  updateAssetOptions(uuid: string, assetOptionsData: AssetOption): void;
}

export const AssetOptionsContext = createContext({} as ProviderState);

const AssetOption = new AssetOptionsServiceBase();

export class AssetOptionsProvider extends Component {
  public readonly state: ProviderState = {
    assetOptions: AssetOption.readAssetOptions() || [],
    createAssetOptions: (assetOptionsData: AssetOption) => {
      AssetOption.createAssetOption(assetOptionsData);
      this.getAssetOptions();
    },
    deleteAssetOptions: (uuid: string) => {
      AssetOption.deleteAssetOption(uuid);
      this.getAssetOptions();
    },
    updateAssetOptions: (uuid: string, assetOptionsData: AssetOption) => {
      AssetOption.updateAssetOption(uuid, assetOptionsData);
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
    const assetOptions: ExtendedAssetOption[] = AssetOption.readAssetOptions() || [];
    this.setState({ assetOptions });
  };
}
