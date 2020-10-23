import { LocalStorage, LSKeys } from '@types';

import { defaultContacts } from './contacts';
import { defaultSettings } from './settings';

export const SCHEMA_BASE: LocalStorage = {
  version: 'v1.1.0',
  mtime: new Date('01/11/2020').valueOf(),
  [LSKeys.ACCOUNTS]: {},
  [LSKeys.ADDRESS_BOOK]: defaultContacts,
  [LSKeys.ASSETS]: {},
  [LSKeys.CONTRACTS]: {},
  [LSKeys.NETWORKS]: {} as LocalStorage[LSKeys.NETWORKS],
  [LSKeys.NOTIFICATIONS]: {},
  [LSKeys.SETTINGS]: defaultSettings,
  [LSKeys.PASSWORD]: '',
  [LSKeys.NETWORK_NODES]: {} as LocalStorage[LSKeys.NETWORK_NODES],
  [LSKeys.USER_ACTIONS]: {} as LocalStorage[LSKeys.USER_ACTIONS]
};
