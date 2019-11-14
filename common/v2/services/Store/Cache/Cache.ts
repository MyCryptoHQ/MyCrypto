import get from 'lodash/get';

import { IS_DEV, generateUUID } from 'v2/utils';
import StorageService from './Storage';
import { LOCALSTORAGE_KEY, ENCRYPTED_STORAGE_KEY, CACHE_INIT } from './constants';
import { DataCache, DataEntry } from './types';
import { initializeCache } from './seedCache';
import { LocalCache } from 'v2/types';

// Keep an in Memory copy of LocalStorage.
// If usefull we can restore ttl checks for stale cache by checking
// https://github.com/MyCryptoHQ/MyCrypto/commit/d10b804e35bb44ce72b8d7d0363b0bbd0ebf7a73
export class CacheServiceBase {
  private cache: DataCache = {};

  public constructor() {
    const persistedCache = StorageService.instance.getEntry(LOCALSTORAGE_KEY);

    if (persistedCache) {
      this.initializeCache(persistedCache);
    }
  }

  public initializeCache(cache: DataCache) {
    this.cache = cache;
  }

  public getEntry(identifier: string, entryKey: string): any {
    this.ensureSubcache(identifier);

    // First, try retrieving the value from the in-memory cache.
    let entry = get(this.cache, `${identifier}.${entryKey}`);

    // If that fails, try retrieving it from LocalStorage.
    if (!entry) {
      const storage = StorageService.instance.getEntry(LOCALSTORAGE_KEY);

      if (storage && storage[identifier]) {
        entry = storage[identifier][entryKey];

        // If it existed in LocalStorage but not in memory, add it to memory.
        (this.cache as any)[identifier][entryKey] = entry;
      }
    }

    return entry;
  }

  public setEntry(identifier: string, entries: DataEntry) {
    this.ensureSubcache(identifier);

    Object.entries(entries).forEach(([key, value]) => (this.cache[identifier][key] = value));

    this.updatePersistedCache();
  }

  public getEntries(identifier: string): any {
    this.ensureSubcache(identifier);

    // First, try retrieving the value from the in-memory cache.
    let entry = get(this.cache, `${identifier}`);

    // If that fails, try retrieving it from LocalStorage.
    if (!entry) {
      const storage = StorageService.instance.getEntry(LOCALSTORAGE_KEY);

      if (storage && storage[identifier]) {
        entry = storage[identifier];

        // If it existed in LocalStorage but not in memory, add it to memory.
        (this.cache as any)[identifier] = entry;
      }
    }

    // Extracts the actual cached values for every entry
    return Object.keys(entry).reduce((result: DataEntry, key) => {
      result[key] = entry[key];
      return result;
    }, {});
  }

  public clearEntry(identifier: string, key: string) {
    this.ensureSubcache(identifier);

    const {
      [identifier]: { [key]: _, ...cache }
    } = this.cache;

    this.cache[identifier] = cache;
    this.updatePersistedCache();
  }

  private ensureSubcache(identifier: string) {
    const subcache = this.cache[identifier];

    if (!subcache) {
      this.cache[identifier] = {};
    }
  }

  private updatePersistedCache() {
    StorageService.instance.setEntry(LOCALSTORAGE_KEY, this.cache);
  }
}

let instantiated = false;

// tslint:disable-next-line
export default class CacheService extends CacheServiceBase {
  public static instance = new CacheService();

  constructor() {
    super();

    if (instantiated) {
      throw new Error(`CacheService has already been instantiated.`);
    } else {
      instantiated = true;
    }

    if (IS_DEV) {
      (window as any).CacheService = this;
    }
  }
}

// Low level operations
export const hardRefreshCache = () => {
  // @ts-ignore Let us set the initial cache values - is rarely used
  setCache(CACHE_INIT);
};

export const getCacheRaw = (): LocalCache => {
  const c = StorageService.instance.getEntry(LOCALSTORAGE_KEY);
  return c ? c : CACHE_INIT;
};

export const getCache = (): LocalCache => {
  initializeCache();
  return getCacheRaw();
};

export const setCache = (newCache: LocalCache) => {
  localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(newCache));
  CacheService.instance.initializeCache((newCache as unknown) as DataCache);
};

export const destroyCache = () => {
  localStorage.removeItem(LOCALSTORAGE_KEY);
  CacheService.instance.initializeCache({});
};

export const getEncryptedCache = (): string => {
  return localStorage.getItem(ENCRYPTED_STORAGE_KEY) || '';
};

export const setEncryptedCache = (newEncryptedCache: string) => {
  localStorage.setItem(ENCRYPTED_STORAGE_KEY, newEncryptedCache);
};

export const destroyEncryptedCache = () => {
  localStorage.removeItem(ENCRYPTED_STORAGE_KEY);
};

// Collection operations

type CollectionKey =
  | 'addressBook'
  | 'accounts'
  | 'assets'
  | 'contracts'
  | 'networks'
  | 'notifications';

type SettingsKey = 'settings' | 'screenLockSettings';

export const create = <K extends CollectionKey>(key: K) => (value: DataEntry) => {
  const uuid = generateUUID();
  const obj = {};
  // @ts-ignore ie. https://app.clubhouse.io/mycrypto/story/2376/remove-ts-ignore-from-common-v2-services-store-localcache-localcache-ts
  obj[uuid] = value;
  CacheService.instance.setEntry(key, obj);
};

export const createWithID = <K extends CollectionKey>(key: K) => (value: DataEntry, id: string) => {
  const uuid = id;
  if (CacheService.instance.getEntry(key, uuid) === undefined) {
    const obj = {};
    // @ts-ignore ie. https://app.clubhouse.io/mycrypto/story/2376/remove-ts-ignore-from-common-v2-services-store-localcache-localcache-ts
    obj[uuid] = value;
    CacheService.instance.setEntry(key, obj);
  } else {
    console.error(`Error: key ${id} already exists in createWithID`);
  }
};

export const read = <K extends CollectionKey>(key: K) => (uuid: string): LocalCache[K][string] => {
  return CacheService.instance.getEntry(key, uuid);
};

export const update = <K extends CollectionKey>(key: K) => (uuid: string, value: DataEntry) => {
  const obj = {};
  // @ts-ignore ie. https://app.clubhouse.io/mycrypto/story/2376/remove-ts-ignore-from-common-v2-services-store-localcache-localcache-ts
  obj[uuid] = value;
  CacheService.instance.setEntry(key, obj);
};

export const updateAll = <K extends CollectionKey | SettingsKey>(key: K) => (value: DataEntry) => {
  CacheService.instance.setEntry(key, value);
};

export const destroy = <K extends CollectionKey>(key: K) => (uuid: string) => {
  CacheService.instance.clearEntry(key, uuid);
};

export const readAll = <K extends CollectionKey>(key: K) => () => {
  const section: LocalCache[K] = readSection(key)();
  const sectionEntries: [string, LocalCache[K][string]][] = Object.entries(section);
  return sectionEntries.map(([uuid, value]) => ({ ...value, uuid }));
};

export const readSection = <K extends CollectionKey | SettingsKey>(key: K) => () => {
  initializeCache();
  const section: LocalCache[K] = CacheService.instance.getEntries(key);
  return section;
};
