import * as utils from 'v2/libs';
import { initializeCache, LocalCache } from 'v2/services/LocalCache';
import { AccountType, ExtendedAccountType } from './types';

export default class AccountTypeServiceBase {
  // TODO: Add duplication/validation handling.
  public init = () => {
    initializeCache();
  };

  public create = (accountType: AccountType) => {
    this.init();
    // Handle AccountType
    const uuid = utils.generateUUID();

    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    const newAccountTypeCache = parsedLocalCache;
    newAccountTypeCache.accountTypes[uuid] = accountType;

    newAccountTypeCache.allAccountTypes = [...newAccountTypeCache.allAccountTypes, uuid];
    localStorage.setItem('MyCryptoCache', JSON.stringify(newAccountTypeCache));
  };

  public read = (uuid: string) => {
    this.init();
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    return parsedLocalCache.accountTypes[uuid];
  };

  public update = (uuid: string, accountType: AccountType) => {
    this.init();
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    const newAccountTypeCache = Object.assign({}, parsedLocalCache.accountTypes[uuid], accountType);

    localStorage.setItem('MyCryptoCache', JSON.stringify(newAccountTypeCache));
  };

  public destroy = (uuid: string) => {
    this.init();
    // Handle AccountType
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    delete parsedLocalCache.accountTypes[uuid];
    const newallAccountTypes = parsedLocalCache.allAccountTypes.filter(
      (obj: string) => obj !== uuid
    );
    parsedLocalCache.allAccountTypes = newallAccountTypes;
    const newCache = parsedLocalCache;
    localStorage.setItem('MyCryptoCache', JSON.stringify(newCache));
  };

  public readAll = () => {
    this.init();
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '[]');
    let out: ExtendedAccountType[] = [];
    if (parsedLocalCache.allAccountTypes && parsedLocalCache.allAccountTypes.length >= 1) {
      parsedLocalCache.allAccountTypes.map((uuid: string) => {
        out.push({ ...parsedLocalCache.accountTypes[uuid], uuid });
      });
    } else {
      out = [];
    }

    return out;
  };
}
