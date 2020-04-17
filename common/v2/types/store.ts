import { SymmetricDifference, ValuesType, $ElementType } from 'utility-types';
import {
  Asset,
  AddressBook,
  ExtendedContract,
  ISettings,
  Network,
  Notification,
  ExtendedAddressBook,
  IAccount,
  ExtendedAsset,
  ExtendedNotification,
  TUuid,
  NetworkId,
  NetworkNodes
} from 'v2/types';

export enum LSKeys {
  ADDRESS_BOOK = 'addressBook',
  ACCOUNTS = 'accounts',
  ASSETS = 'assets',
  CONTRACTS = 'contracts',
  NETWORKS = 'networks',
  NOTIFICATIONS = 'notifications',
  SETTINGS = 'settings',
  PASSWORD = 'password',
  NETWORK_NODES = 'networkNodes'
}

export interface LocalStorage {
  readonly version: string;
  readonly mtime: number;
  readonly [LSKeys.SETTINGS]: ISettings;
  readonly [LSKeys.ACCOUNTS]: Record<TUuid, IAccount>;
  readonly [LSKeys.ASSETS]: Record<TUuid, Asset>;
  readonly [LSKeys.NETWORKS]: Record<NetworkId, Network>;
  readonly [LSKeys.CONTRACTS]: Record<TUuid, ExtendedContract>;
  readonly [LSKeys.ADDRESS_BOOK]: Record<TUuid, AddressBook>;
  readonly [LSKeys.NOTIFICATIONS]: Record<TUuid, Notification>;
  readonly [LSKeys.PASSWORD]: string;
  readonly [LSKeys.NETWORK_NODES]: Record<NetworkId, NetworkNodes>;
}

export type DSKeys = Exclude<LSKeys, LSKeys.NETWORK_NODES>;

export interface DataStore {
  readonly version: string;
  readonly [LSKeys.ACCOUNTS]: IAccount[];
  readonly [LSKeys.ASSETS]: ExtendedAsset[];
  readonly [LSKeys.NETWORKS]: Network[];
  readonly [LSKeys.CONTRACTS]: ExtendedContract[];
  readonly [LSKeys.ADDRESS_BOOK]: ExtendedAddressBook[];
  readonly [LSKeys.NOTIFICATIONS]: ExtendedNotification[];
  readonly [LSKeys.SETTINGS]: ISettings;
  readonly [LSKeys.PASSWORD]: string;
}

export interface EncryptedDataStore {
  readonly data?: string;
}

export type DataStoreEntry = ValuesType<Omit<DataStore, 'version' | 'password'>>;

export type DataStoreItem =
  | $ElementType<SymmetricDifference<DataStoreEntry, ISettings>, number>
  | ISettings;
