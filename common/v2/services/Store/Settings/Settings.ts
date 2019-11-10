import { CACHE_LOCALSTORAGE_KEY, readSettings, updateSettings } from '../Cache';

export const updateSetting = updateSettings('settings');
export const readAllSettings = readSettings('settings');

export const readStorage = () => {
  const currentLocalStorage: string = localStorage.getItem(CACHE_LOCALSTORAGE_KEY) || '[]';
  return currentLocalStorage;
};

export const importStorage = (importedCache: string) => {
  localStorage.setItem(CACHE_LOCALSTORAGE_KEY, importedCache);
};
