import React, { Component, createContext } from 'react';
import AssetServiceBase from 'v2/services/Asset/Asset';
import { Asset, ExtendedAsset } from 'v2/services/Asset';

export interface ProviderState {
  assets: ExtendedAsset[];
  createAsset(assetData: ExtendedAsset): void;
  readAsset(uuid: string): Asset;
  deleteAsset(uuid: string): void;
  updateAsset(uuid: string, assetData: ExtendedAsset): void;
}

export const AssetContext = createContext({} as ProviderState);

const Asset = new AssetServiceBase();

export class AssetProvider extends Component {
  public readonly state: ProviderState = {
    assets: Asset.readAssets() || [],
    createAsset: (assetData: ExtendedAsset) => {
      Asset.createAsset(assetData);
      this.getAssets();
    },
    readAsset: (uuid: string) => {
      return Asset.readAsset(uuid);
    },
    deleteAsset: (uuid: string) => {
      Asset.deleteAsset(uuid);
      this.getAssets();
    },
    updateAsset: (uuid: string, assetData: ExtendedAsset) => {
      Asset.updateAsset(uuid, assetData);
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
