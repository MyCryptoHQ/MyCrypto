import moment from 'moment';

import { SETTINGS_FILENAME } from '@config';
import { LocalStorage } from '@types';
import { noOp } from '@utils';

import { migrate } from './v1.0.0';
import { SCHEMA_BASE } from './data';
import { DBConfig } from './types';

export const dbVersions = {
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

export const dbHistory = ['v1.0.0', 'v0.0.1'];

// @ts-ignore
export const getCurrentDBConfig = () => dbVersions[dbHistory[0]];

// @ts-ignore
export const getPreviousDBConfig = () => dbVersions[dbHistory[1]];

export const getExportFileName = (currentDb: DBConfig, m: moment.Moment) => {
  return `${SETTINGS_FILENAME}_${m.format('YYYY-MM-DD')}_${currentDb.version}.json`;
};

export const getData = () => {
  // 1. check previous database
  const latestDB = getCurrentDBConfig();
  const previousDB = getPreviousDBConfig();
  const existingDBs = Object.keys(localStorage);
  const latestExists =
    existingDBs.findIndex((k) => k === latestDB.main) >= 0 &&
    localStorage[latestDB.main].version === latestDB.version;
  const staleExists = existingDBs.findIndex((k) => k === previousDB.main) >= 0;

  if (latestExists) {
    // use the latest db when it's present
    return localStorage[latestDB.main];
  } else if (staleExists) {
    // if outdated perform migrations & destroy previous db
    console.debug(`Perfoming migration from ${previousDB.version} to ${latestDB.version}`);
    return latestDB.migrate(JSON.parse(localStorage[previousDB.main]), latestDB.defaultValues);
  } else {
    // if empty return default
    return latestDB.defaultValues;
  }
};

export const getEncryptedData = () => {
  const latestDB = getCurrentDBConfig();
  // TODO: Migrations?
  return localStorage[latestDB.vault];
};
