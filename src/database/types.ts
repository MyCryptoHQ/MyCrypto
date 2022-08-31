import { Fiat, LocalStorage, LSKeys, Network, NetworkId } from '@types';

import { NETWORKS_CONFIG } from './data';

/* Types */
type SeedData = typeof NETWORKS_CONFIG | Fiat[];
type StoreProp = Record<NetworkId, Network> | any;
export type StoreAction = (store: LocalStorage) => LocalStorage;
type FlowReducer = (data?: SeedData, store?: LocalStorage) => StoreProp;
export type FlowTransducer = (key: LSKeys) => (fn: FlowReducer) => (data?: SeedData) => StoreAction;
export type GenObject<T> = Record<keyof T, T> | T;

export interface DBConfig {
  version: string;
  main: string;
  vault?: string;
  defaultValues?: LocalStorage;
  schema: TObject;
  migrate?(prev: LocalStorage, curr: LocalStorage): LocalStorage;
}
