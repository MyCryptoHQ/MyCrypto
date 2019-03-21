import * as utils from 'v2/libs';
import { initializeCache, LocalCache } from 'v2/services/LocalCache';
import { Account, ExtendedAccount } from './types';
import { Service } from 'v2/providers';

export default class AccountServiceBase implements Service<Account> {
  // TODO: Add duplication/validation handling.
  public init = () => {
    initializeCache();
  };

  public create = (account: Account) => {
    this.init();
    // Handle Account
    const uuid = utils.generateUUID();

    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    const newAccountCache = parsedLocalCache;
    newAccountCache.accounts[uuid] = account;

    newAccountCache.allAccounts = [...newAccountCache.allAccounts, uuid];
    localStorage.setItem('MyCryptoCache', JSON.stringify(newAccountCache));
  };

  public read = (uuid: string) => {
    this.init();
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    return parsedLocalCache.accounts[uuid];
  };

  public update = (uuid: string, account: Account) => {
    this.init();
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    const newAccountCache = Object.assign({}, parsedLocalCache.accounts[uuid], account);

    localStorage.setItem('MyCryptoCache', JSON.stringify(newAccountCache));
  };

  public destroy = (uuid: string) => {
    this.init();
    // Handle Account
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    delete parsedLocalCache.accounts[uuid];
    const newallAccounts = parsedLocalCache.allAccounts.filter((obj: string) => obj !== uuid);
    parsedLocalCache.allAccounts = newallAccounts;
    const newCache = parsedLocalCache;
    localStorage.setItem('MyCryptoCache', JSON.stringify(newCache));
  };

  public readAll = () => {
    this.init();
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '[]');
    let out: ExtendedAccount[] = [];
    if (parsedLocalCache.allAccounts && parsedLocalCache.allAccounts.length >= 1) {
      parsedLocalCache.allAccounts.map((uuid: string) => {
        out.push({ ...parsedLocalCache.accounts[uuid], uuid });
      });
    } else {
      out = [];
    }

    return out;
  };
}
