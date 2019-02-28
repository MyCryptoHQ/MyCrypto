import * as utils from 'v2/libs';
import { account, extendedAccount } from './types';

export default class AccountServiceBase {
  // TODO: Add duplication/validation handling.
  init = () => {
    const check = localStorage.getItem('MyCryptoCache');
    if (!check || check === '[]' || check === '{}') {
      let newCache = {
        Account: {},
        AccountList: []
      };
      localStorage.setItem('MyCryptoCache', JSON.stringify(newCache));
    }
  };

  createAccount = (account: account) => {
    this.init();
    // Handle Account
    const uuid = utils.generateUUID();

    const localCache = localStorage.getItem('MyCryptoCache') || '{}';
    let parsedLocalCache;
    try {
      parsedLocalCache = JSON.parse(localCache);
    } catch (e) {
      parsedLocalCache = localCache;
    }
    const newAccountCache = parsedLocalCache;
    newAccountCache.Account[uuid] = account;

    newAccountCache.AccountList = [...newAccountCache.AccountList, uuid];
    localStorage.setItem('MyCryptoCache', JSON.stringify(newAccountCache));
  };

  readAccount = (uuid: string) => {
    this.init();
    const localCache = localStorage.getItem('MyCryptoCache') || '{}';
    let parsedLocalCache;
    try {
      parsedLocalCache = JSON.parse(localCache);
    } catch {
      parsedLocalCache = localCache;
    }
    return parsedLocalCache.Account[uuid];
  };

  updateAccount = (uuid: string, account: account) => {
    this.init();
    const localCache = localStorage.getItem('MyCryptoCache') || '{}';
    let parsedLocalCache;
    try {
      parsedLocalCache = JSON.parse(localCache);
    } catch {
      parsedLocalCache = localCache;
    }
    const newAccountCache = Object.assign({}, parsedLocalCache.Account[uuid], account);

    localStorage.setItem('MyCryptoCache', JSON.stringify(newAccountCache));
  };

  deleteAccount = (uuid: string) => {
    this.init();
    // Handle Account
    const localCache = localStorage.getItem('MyCryptoCache') || '{}';
    let parsedLocalCache;
    try {
      parsedLocalCache = JSON.parse(localCache);
    } catch {
      parsedLocalCache = localCache;
    }
    delete parsedLocalCache.Account[uuid];
    const newAccountList = parsedLocalCache.AccountList.filter((obj: string) => obj !== uuid);
    parsedLocalCache.AccountList = newAccountList;
    const newCache = parsedLocalCache;
    localStorage.setItem('MyCryptoCache', JSON.stringify(newCache));
  };

  readAccounts = (): extendedAccount[] => {
    this.init();
    const localCache = localStorage.getItem('MyCryptoCache') || '[]';
    let parsedLocalCache: any;
    let out: extendedAccount[] = [];
    try {
      parsedLocalCache = JSON.parse(localCache);
    } catch (e) {
      parsedLocalCache = localCache;
    }
    if (parsedLocalCache.AccountList && parsedLocalCache.AccountList.length >= 1) {
      parsedLocalCache.AccountList.map((uuid: string) => {
        out.push({ ...parsedLocalCache.Account[uuid], uuid });
      });
    } else {
      out = [];
    }

    return out;
  };
}
