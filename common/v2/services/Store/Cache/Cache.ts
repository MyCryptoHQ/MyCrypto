import get from 'lodash/get';

import { IS_DEV, generateUUID } from 'v2/utils';
import StorageService from './Storage';
import { CACHE_TIME_TO_LIVE, CACHE_LOCALSTORAGE_KEY, ENCRYPTED_CACHE_KEY, CACHE_INIT } from './constants';
import { cachedValueIsFresh } from './helpers';
import { Cache, NewCacheEntry } from './types';
import { initializeCache } from '../LocalCache/seedCache';

export class CacheServiceBase {
  private cache: Cache = {};

  public constructor() {
    const persistedCache = StorageService.instance.getEntry(CACHE_LOCALSTORAGE_KEY);

    if (persistedCache) {
      this.initializeCache(persistedCache);
    }
  }

  public initializeCache(cache: Cache) {
    this.cache = cache;
  }

  public getEntry(identifier: string, entryKey: string): any {
    this.ensureSubcache(identifier);

    // First, try retrieving the value from the in-memory cache.
    let entry = get(this.cache, `${identifier}.${entryKey}`);

    // If that fails, try retrieving it from LocalStorage.
    if (!entry) {
      const storage = StorageService.instance.getEntry(CACHE_LOCALSTORAGE_KEY);

      if (storage && storage[identifier]) {
        entry = storage[identifier][entryKey];

        // If it existed in LocalStorage but not in memory, add it to memory.
        (this.cache as any)[identifier][entryKey] = entry;
      }
    }

    if (cachedValueIsFresh(entry)) {
      return entry.value;
    } else {
      this.clearEntry(identifier, entryKey);
      this.updatePersistedCache();

      return null;
    }
  }

  public setEntry(identifier: string, entries: NewCacheEntry, useTTL?: boolean) {
    //console.log("Set "+ identifier)
    //console.log(entries);
    this.ensureSubcache(identifier);

    Object.entries(entries).forEach(
      ([key, value]) =>
        (this.cache[identifier][key] = {
          value,
          ttl: useTTL ? Date.now() + CACHE_TIME_TO_LIVE : -1
        })
    );

    this.updatePersistedCache();
  }

  public getEntries(identifier: string): any {
    this.ensureSubcache(identifier);

    // First, try retrieving the value from the in-memory cache.
    let entry = get(this.cache, `${identifier}`);

    // If that fails, try retrieving it from LocalStorage.
    if (!entry) {
      const storage = StorageService.instance.getEntry(CACHE_LOCALSTORAGE_KEY);

      if (storage && storage[identifier]) {
        entry = storage[identifier];

        // If it existed in LocalStorage but not in memory, add it to memory.
        (this.cache as any)[identifier] = entry;
      }
    }
    
    return this.objectMap(entry, e => e.value);
    /**if (cachedValueIsFresh(entry)) {
      return entry.map(e => e.value);
    } else {
      //this.clearEntry(identifier, entryKey);
      this.updatePersistedCache();

      return null;
    }**/
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
    StorageService.instance.setEntry(CACHE_LOCALSTORAGE_KEY, this.cache);
  }

  // Utility function for getEntries
  private objectMap(object, mapFn) {
    return Object.keys(object).reduce(function(result, key) {
      result[key] = mapFn(object[key])
      return result
    }, {})
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
  setCache(CACHE_INIT);
};

export const getCacheRaw = (): LocalCache => {
  const c = StorageService.instance.getEntry(CACHE_LOCALSTORAGE_KEY);
  return c ? c : CACHE_INIT;
};

export const getCache = (): LocalCache => {
  initializeCache();
  return getCacheRaw();
};

export const setCache = (newCache: LocalCache) => {
  localStorage.setItem(CACHE_LOCALSTORAGE_KEY, JSON.stringify(newCache));
  CacheService.instance.initializeCache(newCache);
};

export const destroyCache = () => {
  localStorage.removeItem(CACHE_LOCALSTORAGE_KEY);
  CacheService.instance.initializeCache({});
};

export const getEncryptedCache = (): string => {
  return localStorage.getItem(ENCRYPTED_CACHE_KEY) || '';
};

export const setEncryptedCache = (newEncryptedCache: string) => {
  localStorage.setItem(ENCRYPTED_CACHE_KEY, newEncryptedCache);
};

export const destroyEncryptedCache = () => {
  localStorage.removeItem(ENCRYPTED_CACHE_KEY);
};

// Settings operations

type SettingsKey = 'settings' | 'screenLockSettings' | 'networks';

export const readSettings = <K extends SettingsKey>(key: K) => () => {
  return readSection(key)();
};

export const updateSettings = <K extends SettingsKey>(key: K) => (value: LocalCache[K]) => {
  updateAll(key)(value);
};

// Collection operations

type CollectionKey =
  | 'addressBook'
  | 'accounts'
  | 'assets'
  | 'contracts'
  | 'networks'
  | 'notifications';

export const create = <K extends CollectionKey>(key: K) => (
  value: NewCacheEntry
) => {
  const uuid = generateUUID();
  let obj = {}
  // @ts-ignore ie. https://app.clubhouse.io/mycrypto/story/2376/remove-ts-ignore-from-common-v2-services-store-localcache-localcache-ts
  obj[uuid] = value;
  CacheService.instance.setEntry(key, obj);
};

export const createWithID = <K extends CollectionKey>(key: K) => (
  value: NewCacheEntry,
  id: string
) => {
  const uuid = id;
  if (CacheService.instance.getEntry(key, uuid) === null) {
    let obj = {}
    // @ts-ignore ie. https://app.clubhouse.io/mycrypto/story/2376/remove-ts-ignore-from-common-v2-services-store-localcache-localcache-ts
    obj[uuid] = value;
    CacheService.instance.setEntry(key, obj);
  } else {
    console.error(`Error: key ${id} already exists in createWithID`);
  }
};

export const read = <K extends CollectionKey>(key: K) => (uuid: string): LocalCache[K][string] => {
  // @ts-ignore ie. https://app.clubhouse.io/mycrypto/story/2376/remove-ts-ignore-from-common-v2-services-store-localcache-localcache-ts
  return CacheService.instance.getEntry(key, uuid);
};

export const update = <K extends CollectionKey>(key: K) => (
  uuid: string,
  value: NewCacheEntry
) => {
  let obj = {}
  // @ts-ignore ie. https://app.clubhouse.io/mycrypto/story/2376/remove-ts-ignore-from-common-v2-services-store-localcache-localcache-ts
  obj[uuid] = value;
  CacheService.instance.setEntry(key, obj);
};

export const updateAll = <K extends CollectionKey>(key: K) => (
  value: NewCacheEntry
) => {
  CacheService.instance.setEntry(key, value);
};

export const destroy = <K extends CollectionKey>(key: K) => (uuid: string) => {
  CacheService.instance.clearEntry(key, uuid);
};

export const readAll = <K extends CollectionKey>(key: K) => () => {
  //const section: LocalCache[K] = getCache()[key].map(e => e.value);
  const section: LocalCache[K] = readSection(key)();
  const sectionEntries: [string, LocalCache[K][string]][] = Object.entries(section);
  return sectionEntries.map(([uuid, value]) => ({ ...value, uuid }));
};

export const readSection = <K extends CollectionKey>(key: K) => () => {
  //const section: LocalCache[K] = getCache()[key].map(e => e.value);
  initializeCache();
  const section: LocalCache[K] = CacheService.instance.getEntries(key);
  return section;
};
