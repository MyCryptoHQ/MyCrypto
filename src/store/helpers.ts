import { LocalStorage } from '@types';
import { isEmpty, symmetricDifference } from '@vendor';

export const isValidImport = (importedCache: string, localStorage: LocalStorage) => {
  try {
    const parsedImport = JSON.parse(importedCache);

    // @todo: Do migration instead of failing
    if (parsedImport.version !== localStorage.version) {
      throw new Error(
        `Outdated version detected. Cannot import ${parsedImport.version} into ${localStorage.version}`
      );
    }

    const oldKeys = Object.keys(parsedImport);
    const newKeys = Object.keys(localStorage);
    const diff = symmetricDifference(oldKeys, newKeys);
    return isEmpty(diff);
  } catch (error) {
    return false;
  }
};
