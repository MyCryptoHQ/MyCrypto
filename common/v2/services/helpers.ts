import { SHAPESHIFT_ASSET_WHITELIST } from './constants';

export const createAssetMap = (pairs: any[]) =>
  pairs.reduce((prev, next) => {
    const [buy, trade] = next.split('_');
    if (buy) {
      prev[buy.toUpperCase()] = true;
    }
    if (trade) {
      prev[trade.toUpperCase()] = true;
    }
    return prev;
  }, {});

export const getAssetIntersection = (assets: any[]) => {
  const whitelistedAssetMap = createAssetMap(SHAPESHIFT_ASSET_WHITELIST);
  return assets.filter(asset => whitelistedAssetMap[asset]);
};
