import {
  Account,
  Asset,
  AddressBook,
  IContract,
  ISettings,
  INetwork,
  ScreenLockSettings,
  Notification
} from 'typeFiles';

export interface LocalCache {
  settings: ISettings;
  accounts: Record<string, Account>;
  assets: Record<string, Asset>;
  networks: Record<string, INetwork>;
  contracts: Record<string, IContract>;
  addressBook: Record<string, AddressBook>;
  notifications: Record<string, Notification>;
  screenLockSettings?: Partial<ScreenLockSettings>;
}
