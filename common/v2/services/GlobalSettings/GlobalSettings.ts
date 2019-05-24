import { readSettings, updateSettings } from 'v2/services/LocalCache';

export const readCache = () => {
  const localCache: string = localStorage.getItem('MyCryptoCache') || '[]';
  return localCache;
};

export const importCache = (importedCache: string) => {
  localStorage.setItem('MyCryptoCache', importedCache);
};

export const updateGlobalSettings = updateSettings('globalSettings');
export const readGlobalSettings = readSettings('globalSettings');
