import { getCacheRaw, setCache } from './LocalCache';
import { testSettings as defaultCacheSettings } from 'v2/config';

export const updateCacheSettings = () => {
  const prevCache = getCacheRaw();
  setCache({ ...prevCache, settings: { ...defaultCacheSettings, ...prevCache.settings } });
};

export const cacheSettingsUpdateNeeded = () => {
  const prevCache = getCacheRaw();
  const prevCacheSettings = prevCache.settings;
  return Object.keys(defaultCacheSettings).filter(
    key => !Object.keys(prevCacheSettings).includes(key)
  ).length === 0
    ? false
    : true;
};
