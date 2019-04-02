import * as utils from 'v2/libs';
import { getCache, setCache } from 'v2/services/LocalCache';
import { AccountType, ExtendedAccountType } from './types';

export const createAccountType = (accountType: AccountType) => {
  // Handle AccountType
  const uuid = utils.generateUUID();

  const parsedLocalCache = getCache();
  const newAccountTypeCache = parsedLocalCache;
  newAccountTypeCache.accountTypes[uuid] = accountType;

  newAccountTypeCache.allAccountTypes = [...newAccountTypeCache.allAccountTypes, uuid];
  setCache(newAccountTypeCache);
};

export const readAccountType = (uuid: string) => {
  const parsedLocalCache = getCache();
  return parsedLocalCache.accountTypes[uuid];
};

export const updateAccountType = (uuid: string, accountType: AccountType) => {
  const parsedLocalCache = getCache();
  parsedLocalCache.accountTypes[uuid] = accountType;

  setCache(parsedLocalCache);
};

export const deleteAccountType = (uuid: string) => {
  // Handle AccountType
  const parsedLocalCache = getCache();
  delete parsedLocalCache.accountTypes[uuid];
  const newallAccountTypes = parsedLocalCache.allAccountTypes.filter((obj: string) => obj !== uuid);
  parsedLocalCache.allAccountTypes = newallAccountTypes;
  const newCache = parsedLocalCache;
  setCache(newCache);
};

export const readAccountTypes = (): ExtendedAccountType[] => {
  const parsedLocalCache = getCache();
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
