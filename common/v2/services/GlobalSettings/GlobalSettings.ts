import { readSettings, updateSettings } from 'v2/services/LocalCache';

export const readStorage = () => {
  const currentLocalStorage: string = localStorage.getItem('MyCryptoCache') || '[]';
  return currentLocalStorage;
};

export const importCache = (importedCache: string) => {
  localStorage.setItem('MyCryptoCache', importedCache);
};

export const updateGlobalSettings = updateSettings('globalSettings');
export const readGlobalSettings = readSettings('globalSettings');
