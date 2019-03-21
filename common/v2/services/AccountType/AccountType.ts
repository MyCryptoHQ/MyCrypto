import * as utils from 'v2/libs';
import { initializeCache, LocalCache } from 'v2/services/LocalCache';
import { AccountType, ExtendedAccountType } from './types';

export default class AccountTypeServiceBase {
  // TODO: Add duplication/validation handling.
  public init = () => {
    initializeCache();
  };

  public createAccountType = (accountType: AccountType) => {
    this.init();
    // Handle AccountType
    const uuid = utils.generateUUID();

    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    const newAccountTypeCache = parsedLocalCache;
    newAccountTypeCache.accountTypes[uuid] = accountType;

    newAccountTypeCache.allAccountTypes = [...newAccountTypeCache.allAccountTypes, uuid];
    localStorage.setItem('MyCryptoCache', JSON.stringify(newAccountTypeCache));
  };

  public readAccountType = (uuid: string) => {
    this.init();
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    return parsedLocalCache.accountTypes[uuid];
  };

  public updateAccountType = (uuid: string, accountType: AccountType) => {
    this.init();
    const parsedLocalCache: LocalCache = JSON.parse(localStorage.getItem('MyCryptoCache') || '{}');
    const newAccountTypeCache = Object.assign({}, parsedLocalCache.accountTypes[uuid], accountType);

    localStorage.setItem('MyCryptoCache', JSON.stringify(newAccountTypeCache));
  };

  public deleteAccountType = (uuid: string) => {
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

  public readAccountTypes = (): ExtendedAccountType[] => {
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
