import { readSettings, updateSettings } from 'v2/services/LocalCache';
import { CACHE_KEY } from '../LocalCache/constants';

export const readStorage = () => {
  const currentLocalStorage: string = localStorage.getItem(CACHE_KEY) || '[]';
  return currentLocalStorage;
};

export const importCache = (importedCache: string) => {
  localStorage.setItem('MyCryptoCache', importedCache);
};

export const updateGlobalSettings = updateSettings('globalSettings');
export const readGlobalSettings = readSettings('globalSettings');
