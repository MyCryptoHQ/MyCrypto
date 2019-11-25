import { LSKeys, LocalStorage } from 'v2/types';
import { defaultSettings } from '../data';

export const SCHEMA_BASE: LocalStorage = {
  [LSKeys.ACCOUNTS]: {},
  [LSKeys.ADDRESS_BOOK]: {},
  [LSKeys.ASSETS]: {},
  [LSKeys.CONTRACTS]: {},
  [LSKeys.NETWORKS]: {} as LocalStorage[LSKeys.NETWORKS],
  [LSKeys.NOTIFICATIONS]: {},
  [LSKeys.SETTINGS]: defaultSettings
};
