import * as utils from 'v2/libs';
import { Account, ExtendedAccount } from './types';

export default class AccountServiceBase {
  // TODO: Add duplication/validation handling.
  public init = () => {
    const check = localStorage.getItem('MyCryptoCache');
    if (!check || check === '[]' || check === '{}') {
      const newCache = {
        Account: {},
        AccountList: []
      };
      localStorage.setItem('MyCryptoCache', JSON.stringify(newCache));
    }
  };

  public createAccount = (account: Account) => {
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

  public readAccount = (uuid: string) => {
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

  public updateAccount = (uuid: string, account: Account) => {
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

  public deleteAccount = (uuid: string) => {
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

  public readAccounts = (): ExtendedAccount[] => {
    this.init();
    const localCache = localStorage.getItem('MyCryptoCache') || '[]';
    let parsedLocalCache: any;
    let out: ExtendedAccount[] = [];
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
