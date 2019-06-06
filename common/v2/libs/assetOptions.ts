import { getCache } from 'v2/services/LocalCache';
import { AssetOption } from 'v2/services/AssetOption/types';

export const getAssetByTicker = (ticker: string): AssetOption | undefined => {
  const assets = getAllAssetOptions() || [];
  return assets.find((asset: AssetOption) => asset.ticker.toLowerCase() === ticker.toLowerCase());
};

export const getAllAssetOptions = () => {
  return Object.values(getCache().assetOptions);
};
