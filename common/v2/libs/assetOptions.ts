import { getCache } from 'v2/services/LocalCache';
import { AssetOption } from 'v2/services/AssetOption/types';

export const getAssetByTicker = (ticker: string): AssetOption | undefined => {
  const assets = getAllAssets() || [];
  return assets.find((asset: AssetOption) => asset.ticker === ticker);
};

export const getAllAssets = () => {
  return Object.values(getCache().assetOptions);
};
