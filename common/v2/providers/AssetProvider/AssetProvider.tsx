import React, { Component, createContext } from 'react';
import * as service from 'v2/services/Asset/Asset';
import { Asset, ExtendedAsset } from 'v2/services/Asset';

export interface ProviderState {
  assets: ExtendedAsset[];
  createAsset(assetData: ExtendedAsset): void;
  readAsset(uuid: string): Asset;
  deleteAsset(uuid: string): void;
  updateAsset(uuid: string, assetData: ExtendedAsset): void;
}

export const AssetContext = createContext({} as ProviderState);

export class AssetProvider extends Component {
  public readonly state: ProviderState = {
    assets: service.readAssets() || [],
    createAsset: (assetData: ExtendedAsset) => {
      service.createAsset(assetData);
      this.getAssets();
    },
    readAsset: (uuid: string) => {
      return service.readAsset(uuid);
    },
    deleteAsset: (uuid: string) => {
      service.deleteAsset(uuid);
      this.getAssets();
    },
    updateAsset: (uuid: string, assetData: ExtendedAsset) => {
      service.updateAsset(uuid, assetData);
      this.getAssets();
    }
  };

  public render() {
    const { children } = this.props;
    return <AssetContext.Provider value={this.state}>{children}</AssetContext.Provider>;
  }

  private getAssets = () => {
    const assets: ExtendedAsset[] = service.readAssets() || [];
    this.setState({ assets });
  };
}
