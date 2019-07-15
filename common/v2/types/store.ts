import {
  Account,
  Asset,
  AddressBook,
  Contract,
  ISettings,
  Network,
  Wallet,
  ScreenLockSettings,
  Notification
} from 'v2/types';

export interface LocalCache {
  settings: ISettings;
  accounts: Record<string, Account>;
  wallets: Record<string, Wallet>;
  assets: Record<string, Asset>;
  networks: Record<string, Network>;
  contracts: Record<string, Contract>;
  addressBook: Record<string, AddressBook>;
  notifications: Record<string, Notification>;
  screenLockSettings?: Partial<ScreenLockSettings>;
}
