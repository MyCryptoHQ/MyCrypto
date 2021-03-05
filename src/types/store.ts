import {
  Asset,
  ExtendedAsset,
  ExtendedContact,
  ExtendedContract,
  ExtendedNotification,
  ExtendedUserAction,
  IAccount,
  IRates,
  ISettings,
  Network,
  NetworkId,
  NetworkNodes,
  Notification,
  TUuid,
  UserAction
} from '@types';

import { IProvidersMappings } from './asset';

export enum LSKeys {
  ADDRESS_BOOK = 'addressBook',
  ACCOUNTS = 'accounts',
  ASSETS = 'assets',
  RATES = 'rates',
  TRACKED_ASSETS = 'trackedAssets',
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
  readonly [LSKeys.RATES]: IRates;
  readonly [LSKeys.TRACKED_ASSETS]: Record<string, IProvidersMappings>;
  readonly [LSKeys.ADDRESS_BOOK]: Record<TUuid, ExtendedContact>;
  readonly [LSKeys.CONTRACTS]: Record<TUuid, ExtendedContract>;
  readonly [LSKeys.NETWORKS]: Record<NetworkId, Network>;
  readonly [LSKeys.NETWORK_NODES]: Record<NetworkId, NetworkNodes>;
  readonly [LSKeys.NOTIFICATIONS]: Record<TUuid, Notification>;
  readonly [LSKeys.SETTINGS]: ISettings;
  readonly [LSKeys.PASSWORD]: string;
  readonly [LSKeys.USER_ACTIONS]: Record<TUuid, UserAction>;
}
export interface DataStore {
  readonly version: string;
  readonly [LSKeys.ACCOUNTS]: IAccount[];
  readonly [LSKeys.ASSETS]: ExtendedAsset[];
  readonly [LSKeys.RATES]: IRates;
  readonly [LSKeys.TRACKED_ASSETS]: Record<string, IProvidersMappings>;
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
  readonly error?: boolean;
}
