import React, { useContext, createContext } from 'react';
import * as R from 'ramda';

import { ExtendedAsset, LSKeys, TUuid } from 'v2/types';

import { DataContext } from '../DataManager';
import { NetworkContext } from '../Network';

export interface IAssetContext {
  assets: ExtendedAsset[];
  createAssetWithID(assetData: ExtendedAsset, id: TUuid): void;
  updateAssets(newAssets: any): void;
}

export const AssetContext = createContext({} as IAssetContext);

export const AssetProvider: React.FC = ({ children }) => {
  const { createActions, assets } = useContext(DataContext);
  const { getNetworkByChainId } = useContext(NetworkContext);
  const model = createActions(LSKeys.ASSETS);

  const state: IAssetContext = {
    assets,
    createAssetWithID: model.createWithID,
    updateAssets: (newAssets) => {
      const mappedAssets = Object.entries(newAssets).map(([uuid, asset]: [string, any]) => {
        const network = getNetworkByChainId(parseInt(asset.networkId, 10));
        return {
          ...asset,
          uuid,
          contractAddress: asset.address,
          decimal: asset.decimals,
          networkId: network ? network.id : asset.networkId,
          isCustom: false
        };
      });

      const assetsCopy = R.clone(assets);
      mappedAssets.forEach((asset) => {
        const existing = assetsCopy.find((x) => x.uuid === asset.uuid);
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
