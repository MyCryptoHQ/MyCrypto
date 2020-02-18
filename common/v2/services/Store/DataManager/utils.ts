import * as R from 'ramda';
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
  DataStore
} from 'v2/types';
import { makeExplorer } from 'v2/services/EthService';

const createObjHash = (obj: object): string => Object.keys(obj).length.toString();
const createArrHash = (arr: []): string => arr.length.toString();
type ObjToArray = <T>(o: T) => ValuesType<T>[];
const objToArray: ObjToArray = obj => Object.values(obj);
type ArrayToObj = <K extends string | number>(
  k: K
) => <V extends any[]>(arr: V) => Record<K, ValuesType<V>>;
const arrayToObj: ArrayToObj = key => arr =>
  arr.reduce((acc, curr) => ({ ...acc, [curr[key]]: curr }), {});
const memoizeObjToArray = R.memoizeWith(createObjHash, objToArray);
const memoizeArrayToObj = (key: string) => R.memoizeWith(createArrHash, arrayToObj(key));

// From LocalStorage to the state we want to use within the app.
export function marshallState(ls: LocalStorage): DataStore {
  return {
    version: ls.version,
    [LSKeys.ACCOUNTS]: Object.values(ls[LSKeys.ACCOUNTS]),
    [LSKeys.ADDRESS_BOOK]: Object.entries(ls[LSKeys.ADDRESS_BOOK]).reduce(
      (acc, [uuid, contact]: [TUuid, ExtendedAddressBook]) => {
        return acc.concat([{ ...contact, uuid }]);
      },
      [] as ExtendedAddressBook[]
    ),
    [LSKeys.ASSETS]: memoizeObjToArray(ls[LSKeys.ASSETS]),
    [LSKeys.CONTRACTS]: memoizeObjToArray(ls[LSKeys.CONTRACTS]),
    [LSKeys.NETWORKS]: Object.values(ls[LSKeys.NETWORKS]).map(({ blockExplorer, ...rest }) => ({
      ...rest,
      blockExplorer: blockExplorer ? makeExplorer(blockExplorer) : blockExplorer
    })),
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
    [LSKeys.ASSETS]: memoizeArrayToObj('uuid')(st[LSKeys.ASSETS]),
    [LSKeys.CONTRACTS]: memoizeArrayToObj('uuid')(st[LSKeys.CONTRACTS]),
    [LSKeys.NETWORKS]: st[LSKeys.NETWORKS].reduce(
      (acc, curr) => ({ ...acc, [curr.id]: curr }),
      {} as Record<NetworkId, Network>
    ),
    [LSKeys.NOTIFICATIONS]: st[LSKeys.NOTIFICATIONS].reduce(
      (acc, curr) => ({ ...acc, [curr.uuid]: curr }),
      {}
    ),
    [LSKeys.SETTINGS]: st[LSKeys.SETTINGS],
    [LSKeys.PASSWORD]: st[LSKeys.PASSWORD]
  };
}
