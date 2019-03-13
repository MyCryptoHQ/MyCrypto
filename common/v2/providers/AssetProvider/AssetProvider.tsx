import React, { Component, createContext } from 'react';
import AssetServiceBase from 'v2/services/Asset/Asset';
import { ExtendedAsset } from 'v2/services/Asset';

export interface ProviderState {
  assets: ExtendedAsset[];
  createAsset(AssetData: ExtendedAsset): void;
  deleteAsset(uuid: string): void;
  updateAsset(uuid: string, AssetData: ExtendedAsset): void;
}

export const AssetContext = createContext({} as ProviderState);

const Asset = new AssetServiceBase();

export class AssetProvider extends Component {
  public readonly state: ProviderState = {
    assets: Asset.readAssets() || [],
    createAsset: (AssetData: ExtendedAsset) => {
      Asset.createAsset(AssetData);
      this.getAssets();
    },
    deleteAsset: (uuid: string) => {
      Asset.deleteAsset(uuid);
      this.getAssets();
    },
    updateAsset: (uuid: string, AssetData: ExtendedAsset) => {
      Asset.updateAsset(uuid, AssetData);
      this.getAssets();
    }
  };

  public render() {
    const { children } = this.props;
    return <AssetContext.Provider value={this.state}>{children}</AssetContext.Provider>;
  }

  private getAssets = () => {
    const assets: ExtendedAsset[] = Asset.readAssets() || [];
    this.setState({ assets });
  };
}
