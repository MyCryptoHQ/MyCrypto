import * as utils from 'v2/libs';
import { getCache, setCache } from 'v2/services/LocalCache';
import { Account, ExtendedAccount } from './types';

export const createAccount = (account: Account) => {
  // Handle Account
  const uuid = utils.generateUUID();

  const newAccountCache = getCache();
  newAccountCache.accounts[uuid] = account;

  setCache(newAccountCache);
};

export const readAccount = (uuid: string) => {
  return getCache().accounts[uuid];
};

export const updateAccount = (uuid: string, account: Account) => {
  const newAccountCache = getCache();
  newAccountCache.accounts[uuid] = account;

  setCache(newAccountCache);
};

export const deleteAccount = (uuid: string) => {
  // Handle Account
  const parsedLocalCache = getCache();
  delete parsedLocalCache.accounts[uuid];
  const newCache = parsedLocalCache;
  setCache(newCache);
};

export const readAccounts = (): ExtendedAccount[] => {
  return Object.entries(getCache().accounts).map(([uuid, account]) => ({ ...account, uuid }));
};
