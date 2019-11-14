import { LOCALSTORAGE_KEY, updateAll, readSection } from '../Cache';

export const updateSetting = updateAll('settings');
export const readAllSettings = readSection('settings');

export const readStorage = () => {
  const currentLocalStorage: string = localStorage.getItem(LOCALSTORAGE_KEY) || '[]';
  return currentLocalStorage;
};

export const importStorage = (importedCache: string) => {
  localStorage.setItem(LOCALSTORAGE_KEY, importedCache);
};
