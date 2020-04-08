import { Omit, ValuesType } from 'utility-types';

import {
  LocalStorage,
  Network,
  NetworkId,
  Notification,
  ExtendedAddressBook,
  ExtendedNotification,
  LSKeys,
  TUuid,
  DataStore,
  ExtendedContract,
  ExtendedAsset,
  TAddress
} from 'v2/types';
import { makeExplorer } from 'v2/services/EthService';
import { NETWORKS_CONFIG, SCHEMA_BASE } from 'v2/database/data';
import { createDefaultValues } from 'v2/database';

type ObjToArray = <T>(o: T) => ValuesType<T>[];
const objToArray: ObjToArray = obj => Object.values(obj);
type ArrayToObj = <K extends string | number>(
  k: K
) => <V extends any[]>(arr: V) => Record<K, ValuesType<V>>;
const arrayToObj: ArrayToObj = key => arr =>
  arr.reduce((acc, curr) => ({ ...acc, [curr[key]]: curr }), {});

const mergeConfigWithLocalStorage = (ls: LocalStorage): LocalStorage => {
  // fetch data from endpoint
  const defaultConfig = NETWORKS_CONFIG;

  // add contracts and assets from localstorage
  const lsContracts = objToArray(ls[LSKeys.CONTRACTS]) as ExtendedContract[];
  const lsAssets = objToArray(ls[LSKeys.ASSETS]) as ExtendedAsset[];
  lsContracts.forEach(c => defaultConfig[c.networkId].contracts.push(c));
  lsAssets.forEach(
    a =>
      a.networkId &&
      defaultConfig[a.networkId].tokens.push({ ...a, address: a.contractAddress as TAddress })
  );

  return createDefaultValues(SCHEMA_BASE, defaultConfig);
};

// From LocalStorage to the state we want to use within the app.
export function marshallState(ls: LocalStorage): DataStore {
  const mergedLs = mergeConfigWithLocalStorage(ls);

  return {
    version: ls.version,
    [LSKeys.ACCOUNTS]: Object.values(ls[LSKeys.ACCOUNTS]),
    [LSKeys.ADDRESS_BOOK]: Object.entries(ls[LSKeys.ADDRESS_BOOK]).reduce(
      (acc, [uuid, contact]: [TUuid, ExtendedAddressBook]) => {
        return acc.concat([{ ...contact, uuid }]);
      },
      [] as ExtendedAddressBook[]
    ),
    [LSKeys.ASSETS]: objToArray(mergedLs[LSKeys.ASSETS]) as ExtendedAsset[],
    [LSKeys.CONTRACTS]: objToArray(mergedLs[LSKeys.CONTRACTS]) as ExtendedContract[],
    [LSKeys.NETWORKS]: Object.values(mergedLs[LSKeys.NETWORKS]).map(
      ({ blockExplorer, ...rest }) => ({
        ...rest,
        blockExplorer: blockExplorer ? makeExplorer(blockExplorer) : blockExplorer
      })
    ),
    [LSKeys.NOTIFICATIONS]: Object.entries(ls[LSKeys.NOTIFICATIONS]).reduce(
      (acc, [uuid, n]: [TUuid, Notification]) => {
        return acc.concat([{ ...n, uuid }]);
      },
      [] as ExtendedNotification[]
    ),
    [LSKeys.SETTINGS]: ls[LSKeys.SETTINGS],
    [LSKeys.PASSWORD]: ls[LSKeys.PASSWORD]
  };
}

// From convert back to the LocalStorage format.
// The mtime and version are handled by useDatabase
export function deMarshallState(st: DataStore): Omit<LocalStorage, 'mtime'> {
  return {
    version: st.version,
    [LSKeys.ACCOUNTS]: st[LSKeys.ACCOUNTS].reduce(
      (acc, curr) => ({ ...acc, [curr.uuid]: curr }),
      {}
    ),
    [LSKeys.ADDRESS_BOOK]: st[LSKeys.ADDRESS_BOOK].reduce(
      (acc, curr) => ({ ...acc, [curr.uuid]: curr }),
      {}
    ),
    [LSKeys.ASSETS]: arrayToObj('uuid')(st[LSKeys.ASSETS].filter(a => a.isCustom)),
    [LSKeys.CONTRACTS]: arrayToObj('uuid')(st[LSKeys.CONTRACTS].filter(c => c.isCustom)),
    [LSKeys.NETWORKS]: st[LSKeys.NETWORKS]
      .filter(c => c.isCustom)
      .reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {} as Record<NetworkId, Network>),
    [LSKeys.NOTIFICATIONS]: st[LSKeys.NOTIFICATIONS].reduce(
      (acc, curr) => ({ ...acc, [curr.uuid]: curr }),
      {}
    ),
    [LSKeys.SETTINGS]: st[LSKeys.SETTINGS],
    [LSKeys.PASSWORD]: st[LSKeys.PASSWORD]
  };
}
