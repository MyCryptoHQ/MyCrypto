import { getCache, setCache } from 'v2/services/LocalCache';
import { GlobalSettings } from './types';

export const updateGlobalSettings = (newGlobalSettings: GlobalSettings) => {
  const newLocalCache = getCache();
  newLocalCache.globalSettings = newGlobalSettings;
  setCache(newLocalCache);
};

export const readGlobalSettings = (): GlobalSettings => {
  return getCache().globalSettings;
};
