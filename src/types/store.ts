import {
  Asset,
  Contact,
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

/**
 * The type of our persist layer
 */
export interface LocalStorage {
  readonly version: string;
  readonly mtime: number;
  readonly [LSKeys.SETTINGS]: ISettings;
  readonly [LSKeys.ACCOUNTS]: Record<TUuid, IAccount>;
  readonly [LSKeys.ASSETS]: Record<TUuid, Asset>;
  readonly [LSKeys.NETWORKS]: Record<NetworkId, Network>;
  readonly [LSKeys.CONTRACTS]: Record<TUuid, ExtendedContract>;
  readonly [LSKeys.ADDRESS_BOOK]: Record<TUuid, Contact>;
  readonly [LSKeys.NOTIFICATIONS]: Record<TUuid, Notification>;
  readonly [LSKeys.PASSWORD]: string;
  readonly [LSKeys.NETWORK_NODES]: Record<NetworkId, NetworkNodes>;
  readonly [LSKeys.USER_ACTIONS]: Record<TUuid, UserAction>;
}

/**
 * Intermediary type used by legacy StoreProvider.
 * Perisitence: LocalStorage > State: AppState > StoreProvider
 * - an action within the app will update the State
 * - redux-perist will sync the State with LocalStorage
 * - we will be able to replace StoreProvider with selectors
 */
export interface DataStore {
  readonly [LSKeys.ACCOUNTS]: IAccount[];
  readonly [LSKeys.ASSETS]: ExtendedAsset[];
  readonly [LSKeys.NETWORKS]: Network[];
  readonly [LSKeys.CONTRACTS]: ExtendedContract[];
  readonly [LSKeys.ADDRESS_BOOK]: ExtendedContact[];
  readonly [LSKeys.NOTIFICATIONS]: ExtendedNotification[];
  readonly [LSKeys.SETTINGS]: ISettings;
  readonly [LSKeys.PASSWORD]: string;
  readonly [LSKeys.USER_ACTIONS]: ExtendedUserAction[];
}
