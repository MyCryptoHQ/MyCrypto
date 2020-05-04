import React, { useContext, createContext } from 'react';
import clone from 'ramda/src/clone';

import { ExtendedAsset, LSKeys, TUuid, StoreAsset, Asset } from 'v2/types';

import { DataContext } from '../DataManager';
import { getAssetByUUID } from './helpers';

export interface IAssetContext {
  assets: ExtendedAsset[];
  createAssetWithID(assetData: ExtendedAsset, id: TUuid): void;
  getAssetByUUID(uuid: TUuid): Asset | undefined;
  addAssetsFromAPI(newAssets: Record<TUuid, StoreAsset>): void;
}

export const AssetContext = createContext({} as IAssetContext);

export const AssetProvider: React.FC = ({ children }) => {
  const { createActions, assets } = useContext(DataContext);
  const model = createActions(LSKeys.ASSETS);

  const state: IAssetContext = {
    assets,
    createAssetWithID: model.createWithID,
    getAssetByUUID: (uuid) => getAssetByUUID(assets)(uuid),
    addAssetsFromAPI: (newAssets) => {
      const mappedAssets = Object.entries(newAssets).map(([uuid, asset]: [TUuid, StoreAsset]) => ({
        ...asset,
        uuid,
        isCustom: false
      }));

      // make a copy of current assets array and merge it with assets received from API
      const assetsCopy = clone(assets);
      mappedAssets.forEach((asset) => {
        const existing = getAssetByUUID(assetsCopy)(asset.uuid);
        if (existing) {
          Object.assign(existing, asset);
        } else {
          assetsCopy.push(asset);
        }
      });
      model.updateAll(assetsCopy);
    }
  };

  return <AssetContext.Provider value={state}>{children}</AssetContext.Provider>;
};
