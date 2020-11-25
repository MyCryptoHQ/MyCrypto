import { $ElementType, SymmetricDifference, ValuesType } from 'utility-types';

import {
  Asset,
  ExtendedAsset,
  ExtendedContact,
  ExtendedContract,
  ExtendedNotification,
  ExtendedUserAction,
  IAccount,
  ISettings,
  Network,
  NetworkId,
  NetworkNodes,
  Notification,
  TUuid,
  UserAction
} from '@types';

export enum LSKeys {
  ADDRESS_BOOK = 'addressBook',
  ACCOUNTS = 'accounts',
  ASSETS = 'assets',
  CONTRACTS = 'contracts',
  NETWORKS = 'networks',
  NOTIFICATIONS = 'notifications',
  SETTINGS = 'settings',
  PASSWORD = 'password',
  NETWORK_NODES = 'networkNodes',
  USER_ACTIONS = 'userActions'
}

export interface LocalStorage {
  readonly version: string;
  readonly mtime: number;
  readonly [LSKeys.ACCOUNTS]: Record<TUuid, IAccount>;
  readonly [LSKeys.ASSETS]: Record<TUuid, Asset>;
  readonly [LSKeys.ADDRESS_BOOK]: Record<TUuid, ExtendedContact>;
  readonly [LSKeys.CONTRACTS]: Record<TUuid, ExtendedContract>;
  readonly [LSKeys.NETWORKS]: Record<NetworkId, Network>;
  readonly [LSKeys.NETWORK_NODES]: Record<NetworkId, NetworkNodes>;
  readonly [LSKeys.NOTIFICATIONS]: Record<TUuid, Notification>;
  readonly [LSKeys.SETTINGS]: ISettings;
  readonly [LSKeys.PASSWORD]: string;
  readonly [LSKeys.USER_ACTIONS]: Record<TUuid, UserAction>;
}

export type DSKeys = Exclude<LSKeys, LSKeys.NETWORK_NODES>;

export interface DataStore {
  readonly version: string;
  readonly [LSKeys.ACCOUNTS]: IAccount[];
  readonly [LSKeys.ASSETS]: ExtendedAsset[];
  readonly [LSKeys.ADDRESS_BOOK]: ExtendedContact[];
  readonly [LSKeys.CONTRACTS]: ExtendedContract[];
  readonly [LSKeys.NETWORKS]: Network[];
  readonly [LSKeys.NOTIFICATIONS]: ExtendedNotification[];
  readonly [LSKeys.SETTINGS]: ISettings;
  readonly [LSKeys.PASSWORD]: string;
  readonly [LSKeys.USER_ACTIONS]: ExtendedUserAction[];
}

export interface EncryptedDataStore {
  readonly data?: string;
}

export type DataStoreEntry = ValuesType<Omit<DataStore, 'version' | 'password'>>;

export type DataStoreItem =
  | $ElementType<SymmetricDifference<DataStoreEntry, ISettings>, number>
  | ISettings;
