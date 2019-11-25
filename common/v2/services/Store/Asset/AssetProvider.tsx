import React, { useContext, createContext } from 'react';

import { ExtendedAsset, LSKeys, TUuid } from 'v2/types';
import { DataContext } from '../DataManager';

export interface IAssetContext {
  assets: ExtendedAsset[];
  createAssetWithID(assetData: ExtendedAsset, id: TUuid): void;
}

export const AssetContext = createContext({} as IAssetContext);

export const AssetProvider: React.FC = ({ children }) => {
  const { createActions, assets } = useContext(DataContext);
  const model = createActions(LSKeys.ASSETS);

  const state: IAssetContext = {
    assets,
    createAssetWithID: model.createWithID
  };

  return <AssetContext.Provider value={state}>{children}</AssetContext.Provider>;
};
