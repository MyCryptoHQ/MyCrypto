import { SETTINGS_FILENAME } from '@config';
import { LocalStorage } from '@types';
import { formatDate } from '@utils/date';
import { noOp } from '@utils/noOp';

import { SCHEMA_BASE } from './data';
import { DBConfig } from './types';
import { migrate } from './v1.0.0';

export const dbVersions = {
  'v2.0.0': {
    version: 'v2.0.0',
    main: 'MYC_Storage',
    schema: {},
    migrate: (prev: LocalStorage, curr: LocalStorage) => migrate(prev, curr)
  },
  'v1.0.0': {
    version: 'v1.0.0',
    main: 'MYC_Storage',
    vault: 'MYC_Vault',
    defaultValues: SCHEMA_BASE,
    schema: {},
    migrate: (prev: LocalStorage, curr: LocalStorage) => migrate(prev, curr)
  },
  'v0.0.1': {
    version: 'v0.0.1',
    main: 'MyCryptoStorage',
    vault: 'MyCryptoEncrypted',
    schema: {},
    migrate: noOp
  }
};

export const dbHistory = ['v2.0.0', 'v1.0.0', 'v0.0.1'] as const;

export const getCurrentDBConfig = () => dbVersions[dbHistory[0]];

export const getPreviousDBConfig = () => dbVersions[dbHistory[1]];

export const getExportFileName = (currentDb: DBConfig, date: Date) => {
  return `${SETTINGS_FILENAME}_${formatDate(date)}_${currentDb.version}.json`;
};
