import { initializeCache, LocalCache } from 'v2/services/LocalCache';
import { ExtendedRecentAccounts } from './types';

export default class RecentAccountsServiceBase {
  // TODO: Add duplication/validation handling.
  public init = () => {
    initializeCache();
  };

  public createRecentAccounts = (uuid: string) => {
    this.init();
    // Handle RecentAccounts

    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    const newRecentAccountsCache = parsedLocalCache;

    newRecentAccountsCache.recentAccounts = [...newRecentAccountsCache.recentAccounts, uuid];
    localStorage.setItem('MyCryptoCache', JSON.stringify(newRecentAccountsCache));
  };

  public readRecentAccounts = (uuid: string) => {
    this.init();
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    return parsedLocalCache.addressMetadata[uuid];
  };

  public deleteRecentAccounts = (uuid: string) => {
    this.init();
    // Handle RecentAccounts
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    const newallRecentAccounts = parsedLocalCache.recentAccounts.filter(
      (obj: string) => obj !== uuid
    );
    parsedLocalCache.recentAccounts = newallRecentAccounts;
    const newCache = parsedLocalCache;
    localStorage.setItem('MyCryptoCache', JSON.stringify(newCache));
  };

  public readAllRecentAccounts = (): ExtendedRecentAccounts[] => {
    this.init();
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '[]');
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
}
