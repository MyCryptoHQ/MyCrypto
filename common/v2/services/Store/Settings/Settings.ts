import { CACHE_KEY, readSettings, updateSettings } from '../LocalCache';

export const updateSetting = updateSettings('settings');
export const readAllSettings = readSettings('settings');

export const readStorage = () => {
  const currentLocalStorage: string = localStorage.getItem(CACHE_KEY) || '[]';
  return currentLocalStorage;
};

export const importStorage = (importedCache: string) => {
  localStorage.setItem(CACHE_KEY, importedCache);
};
