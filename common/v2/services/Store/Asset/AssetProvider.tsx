import React, { Component, createContext } from 'react';

import { Asset, ExtendedAsset } from 'v2/types';
import {
  readAssets,
  readAsset,
  createAsset,
  deleteAsset,
  updateAsset,
  createAssetWithID
} from './Asset';

export interface ProviderState {
  assets: ExtendedAsset[];
  createAsset(assetData: ExtendedAsset): void;
  createAssetWithID(assetData: ExtendedAsset, id: string): void;
  readAsset(uuid: string): Asset;
  deleteAsset(uuid: string): void;
  updateAsset(uuid: string, assetData: ExtendedAsset): void;
}

export const AssetContext = createContext({} as ProviderState);

export class AssetProvider extends Component {
  public readonly state: ProviderState = {
    assets: readAssets() || [],
    createAsset: (assetData: ExtendedAsset) => {
      createAsset(assetData);
      this.getAssets();
    },
    createAssetWithID: (assetData: ExtendedAsset, id: string) => {
      createAssetWithID(assetData, id);
      this.getAssets();
    },
    readAsset: (uuid: string) => {
      return readAsset(uuid);
    },
    deleteAsset: (uuid: string) => {
      deleteAsset(uuid);
      this.getAssets();
    },
    updateAsset: (uuid: string, assetData: ExtendedAsset) => {
      updateAsset(uuid, assetData);
      this.getAssets();
    }
  };

  public render() {
    const { children } = this.props;
    return <AssetContext.Provider value={this.state}>{children}</AssetContext.Provider>;
  }

  private getAssets = () => {
    const assets: ExtendedAsset[] = readAssets() || [];
    this.setState({ assets });
  };
}
