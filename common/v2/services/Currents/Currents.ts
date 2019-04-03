import { getCache, setCache } from 'v2/services/LocalCache';
import { Currents } from './types';

export const updateCurrents = (newCurrents: Currents) => {
  const newLocalCache = getCache();
  newLocalCache.currents = newCurrents;
  setCache(newLocalCache);
};

export const readCurrents = (): Currents => {
  return getCache().currents;
};
