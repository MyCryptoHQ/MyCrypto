import { readSettings, updateSettings } from 'v2/services/LocalCache';
import { CACHE_KEY } from '../LocalCache/constants';

export const updateSetting = updateSettings('settings');
export const readAllSettings = readSettings('settings');

export const readStorage = () => {
  const currentLocalStorage: string = localStorage.getItem(CACHE_KEY) || '[]';
  return currentLocalStorage;
};

export const importStorage = (importedCache: string) => {
  localStorage.setItem(CACHE_KEY, importedCache);
};
