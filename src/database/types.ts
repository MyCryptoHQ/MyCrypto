import { Asset, AddressBook, LocalStorage, NetworkId, Network, TUuid, Fiat, LSKeys } from '@types';

import { DevAccount } from './seed';
import { NETWORKS_CONFIG } from './data';

/* Types */
type DevData = Asset[] | DevAccount[] | Record<string | TUuid, AddressBook>;
export type SeedData = typeof NETWORKS_CONFIG | Fiat[] | DevData;
type StoreProp = Record<NetworkId, Network> | any;
export type StoreAction = (store: LocalStorage) => LocalStorage;
type FlowReducer = (data?: SeedData, store?: LocalStorage) => StoreProp;
export type FlowTransducer = (key: LSKeys) => (fn: FlowReducer) => (data?: SeedData) => StoreAction;
export type GenObject<T> = Record<keyof T, T> | T;

export interface DBConfig {
  version: string;
  main: string;
  vault: string;
  defaultValues?: LocalStorage;
  schema: {};
  migrate?(prev: LocalStorage, curr: LocalStorage): LocalStorage;
}
