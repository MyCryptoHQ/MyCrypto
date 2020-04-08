import { LSKeys, LocalStorage } from 'v2/types';

import { defaultSettings } from './settings';

export const SCHEMA_BASE: LocalStorage = {
  version: 'v1.0.0',
  mtime: new Date('01/01/2020').valueOf(),
  [LSKeys.ACCOUNTS]: {},
  [LSKeys.ADDRESS_BOOK]: {},
  [LSKeys.ASSETS]: {},
  [LSKeys.CONTRACTS]: {},
  [LSKeys.NETWORKS]: {} as LocalStorage[LSKeys.NETWORKS],
  [LSKeys.NOTIFICATIONS]: {},
  [LSKeys.SETTINGS]: defaultSettings,
  [LSKeys.PASSWORD]: ''
};
