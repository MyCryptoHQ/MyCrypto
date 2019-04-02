import * as utils from 'v2/libs';
import { getCache, setCache } from 'v2/services/LocalCache';
import { AccountType, ExtendedAccountType } from './types';

export const createAccountType = (accountType: AccountType) => {
  // Handle AccountType
  const uuid = utils.generateUUID();

  const parsedLocalCache = getCache();
  const newAccountTypeCache = parsedLocalCache;
  newAccountTypeCache.accountTypes[uuid] = accountType;

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
  const newCache = parsedLocalCache;
  setCache(newCache);
};

export const readAccountTypes = (): ExtendedAccountType[] => {
  return Object.entries(getCache().accountTypes).map(([uuid, accountType]) => ({
    ...accountType,
    uuid
  }));
};
