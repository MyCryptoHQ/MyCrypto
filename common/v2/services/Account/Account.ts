import * as utils from 'v2/libs';
import { initializeCache, LocalCache } from 'v2/services/LocalCache';
import { Account, ExtendedAccount } from './types';

function getCache(): LocalCache {
  initializeCache();

  // We can assume that the MyCryptoCache key exists because it's created in initialCache
  const text = localStorage.getItem('MyCryptoCache') as string;
  return JSON.parse(text);
}

export default {
  createAccount(account: Account) {
    // Handle Account
    const uuid = utils.generateUUID();

    const newAccountCache = getCache();
    newAccountCache.accounts[uuid] = account;

    newAccountCache.allAccounts = [...newAccountCache.allAccounts, uuid];
    localStorage.setItem('MyCryptoCache', JSON.stringify(newAccountCache));
  },

  readAccount(uuid: string) {
    return getCache().accounts[uuid];
  },

  updateAccount(uuid: string, account: Account) {
    const newAccountCache = Object.assign({}, this.readAccount(uuid), account);

    localStorage.setItem('MyCryptoCache', JSON.stringify(newAccountCache));
  },

  deleteAccount(uuid: string) {
    // Handle Account
    const parsedLocalCache = getCache();
    delete parsedLocalCache.accounts[uuid];
    const newallAccounts = parsedLocalCache.allAccounts.filter((obj: string) => obj !== uuid);
    parsedLocalCache.allAccounts = newallAccounts;
    const newCache = parsedLocalCache;
    localStorage.setItem('MyCryptoCache', JSON.stringify(newCache));
  },

  readAccounts(): ExtendedAccount[] {
    const parsedLocalCache = getCache();
    let out: ExtendedAccount[] = [];
    if (parsedLocalCache.allAccounts && parsedLocalCache.allAccounts.length >= 1) {
      parsedLocalCache.allAccounts.map((uuid: string) => {
        out.push({ ...parsedLocalCache.accounts[uuid], uuid });
      });
    } else {
      out = [];
    }

    return out;
  }
};
