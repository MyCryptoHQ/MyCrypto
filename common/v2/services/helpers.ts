import { CACHE_TIME_TO_LIVE, SHAPESHIFT_ASSET_WHITELIST } from './constants';

export interface Cache {
  [entry: string]: {
    value: any;
    ttl: number;
  };
}

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

export const addValueToCache = (cache: Cache, entry: string, value: any) =>
  (cache[entry] = {
    value,
    ttl: Date.now() + CACHE_TIME_TO_LIVE
  });

export const removeValueFromCache = (cache: Cache, entry: string) => {
  const { [entry]: _, ...newCache } = cache;

  return newCache;
};

export const cachedValueIsFresh = (cached: any): boolean => cached && Date.now() < cached.ttl;
