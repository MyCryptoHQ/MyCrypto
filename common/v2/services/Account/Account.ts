import * as utils from 'v2/libs';
import { getCache, setCache, LocalCache } from 'v2/services/LocalCache';

type Key = 'accounts' | 'accountTypes';

const create = <K extends Key>(key: K) => (value: LocalCache[K][keyof LocalCache[K]]) => {
  const uuid = utils.generateUUID();

  const newCache = getCache();
  newCache[key][uuid] = value;

  setCache(newCache);
};

const read = <K extends Key>(key: K) => (uuid: string) => {
  return getCache()[key][uuid];
};

const update = <K extends Key>(key: K) => (
  uuid: string,
  value: LocalCache[K][keyof LocalCache[K]]
) => {
  const newCache = getCache();
  newCache[key][uuid] = value;

  setCache(newCache);
};

const destroy = <K extends Key>(key: K) => (uuid: string) => {
  const parsedLocalCache = getCache();
  delete parsedLocalCache[key][uuid];
  const newCache = parsedLocalCache;
  setCache(newCache);
};

const readAll = <K extends Key>(key: K) => () => {
  const section: LocalCache[K] = getCache()[key];
  const sectionEntries: [string, LocalCache[K][string]][] = Object.entries(section);
  return sectionEntries.map(([uuid, value]) => ({ ...value, uuid }));
};

export const createAccount = create('accounts');
export const readAccount = read('accounts');
export const updateAccount = update('accounts');
export const deleteAccount = destroy('accounts');
export const readAccounts = readAll('accounts');
