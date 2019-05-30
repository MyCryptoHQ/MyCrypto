import { getCache } from 'v2/services/LocalCache/LocalCache';
import { AssetOption } from 'v2/services/AssetOption/types';

export const getAllAssetsOptions = (): AssetOption[] => {
  return Object.values(getCache().assetOptions);
};

export const getAssetOptionByName = (name: string): AssetOption | undefined => {
  const allAssets = getAllAssetsOptions();
  return allAssets.find(asset => asset.ticker === name);
};
