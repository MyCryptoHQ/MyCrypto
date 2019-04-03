import { LocalCache, setCache, getCache } from 'v2/services/LocalCache';
import { ExtendedRecentAccounts } from './types';

export const createRecentAccounts = (uuid: string) => {
  // Handle RecentAccounts

  const newRecentAccountsCache = getCache();

  newRecentAccountsCache.recentAccounts = [...newRecentAccountsCache.recentAccounts, uuid];
  setCache(newRecentAccountsCache);
};

export const readRecentAccounts = (uuid: string) => {
  return getCache().addressMetadata[uuid];
};

export const deleteRecentAccounts = (uuid: string) => {
  // Handle RecentAccounts
  const parsedLocalCache = getCache();
  const newallRecentAccounts = parsedLocalCache.recentAccounts.filter(
    (obj: string) => obj !== uuid
  );
  parsedLocalCache.recentAccounts = newallRecentAccounts;
  const newCache = parsedLocalCache;
  setCache(newCache);
};

export const readAllRecentAccounts = (): ExtendedRecentAccounts[] => {
  const parsedLocalCache: LocalCache = getCache();
  let out: ExtendedRecentAccounts[] = [];
  if (parsedLocalCache.recentAccounts && parsedLocalCache.recentAccounts.length >= 1) {
    parsedLocalCache.recentAccounts.map((uuid: string) => {
      out.push({ ...parsedLocalCache.addressMetadata[uuid], uuid });
    });
  } else {
    out = [];
  }

  return out;
};
