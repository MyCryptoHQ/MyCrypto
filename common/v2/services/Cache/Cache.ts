import get from 'lodash/get';

import { isDevelopment, storageGet, storageSet } from 'v2/utils';
import { CACHE_TIME_TO_LIVE, CACHE_LOCALSTORAGE_KEY } from './constants';
import { cachedValueIsFresh } from './helpers';
import { Cache, NewCacheEntry } from './types';

export class CacheServiceBase {
  private cache: Cache = {};

  public constructor() {
    const persistedCache = storageGet(CACHE_LOCALSTORAGE_KEY);

    if (persistedCache) {
      this.initializeCache(persistedCache);
    }
  }

  public initializeCache(cache: Cache) {
    this.cache = cache;
  }

  public getEntry(identifier: string, entryKey: string): any {
    this.ensureSubcache(identifier);

    const entry = get(this.cache, `${identifier}.${entryKey}`);

    if (cachedValueIsFresh(entry)) {
      return entry.value;
    } else {
      this.clearEntry(identifier, entryKey);
      this.updatePersistedCache();

      return null;
    }
  }

  public setEntry(identifier: string, entries: NewCacheEntry) {
    this.ensureSubcache(identifier);

    Object.entries(entries).forEach(
      ([key, value]) =>
        (this.cache[identifier][key] = {
          value,
          ttl: Date.now() + CACHE_TIME_TO_LIVE
        })
    );

    this.updatePersistedCache();
  }

  public clearEntry(identifier: string, key: string) {
    this.ensureSubcache(identifier);

    const { [identifier]: { [key]: _, ...cache } } = this.cache;

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
    storageSet(CACHE_LOCALSTORAGE_KEY, this.cache);
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

    if (isDevelopment()) {
      (window as any).CacheService = this;
    }
  }
}
