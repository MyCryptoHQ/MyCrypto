import React, { createContext, Dispatch, useReducer, useCallback, useMemo } from 'react';

import { DataStore, LSKeys } from 'v2/types';
import { useThrottleFn, useEvent } from 'v2/vendor';
import {
  addDevSeedToSchema,
  removeSeedDataFromSchema,
  getCurrentDBConfig,
  getData
} from 'v2/database';

import { appDataReducer, ActionV, ActionT, ActionPayload } from './reducer';
import { ActionFactory } from './actions';
import { deMarshallState, marshallState } from './utils';
import { DatabaseService } from './DatabaseService';

export interface DataCacheManager extends DataStore {
  createActions(k: LSKeys): ReturnType<typeof ActionFactory>;
  resetAppDb(): void;
  addSeedData(): void;
  removeSeedData(): void;
}

interface EncryptedStorage {
  encryptedDb: any;
  setEncryptedCache(ls: string): void;
  destroyEncryptedCache(): void;
  setUnlockPassword(pwd: string): void;
  getUnlockPassword(): string;
}
export type IDataContext = DataCacheManager & EncryptedStorage;

export const DataContext = createContext({} as IDataContext);

export const DataProvider: React.FC = ({ children }) => {
  /*
   *  Create the our master store, sync with persistance layer,
   *  Provide lj
   */
  const currentDB = useMemo(() => getCurrentDBConfig(), []);
  const currentDBValues = useMemo(() => getData(), []);
  const { db, updateDb, resetDb, defaultValues } = DatabaseService(
    currentDB.main,
    currentDBValues,
    currentDB.defaultValues
  );

  const [appState, dispatch]: [DataStore, Dispatch<ActionV>] = useReducer(
    appDataReducer,
    db, // Initial state
    marshallState // method to run on initial state
  );

  const resetAppDb = useCallback(
    (newDb = defaultValues) => {
      resetDb(newDb); // Reset the persistence layer
      dispatch({
        type: ActionT.RESET,
        payload: { data: marshallState(newDb) } as ActionPayload<DataStore>
      }); // Reset the Context
    },
    [defaultValues]
  );

  /*
   * Manage sync between appState an db
   */
  const syncDb = (state: DataStore) => {
    console.debug('Updating LocalStorage');
    updateDb(deMarshallState(state));
  };
  // By default we sync no more than once a 30 seconds
  useThrottleFn(syncDb, 30000, [appState]);
  // In any case, we sync before the tab is closed
  // https://developers.google.com/web/updates/2018/07/page-lifecycle-api
  useEvent('visibilitychange', () => {
    if (document.hidden) {
      syncDb(appState);
    }
  });

  /*
   * Toggle seed data
   */
  const addSeedData = useCallback(() => {
    resetAppDb(addDevSeedToSchema(db));
  }, [db]);

  const removeSeedData = useCallback(() => {
    resetAppDb(removeSeedDataFromSchema(db));
  }, []);

  /*
   *  Handle db encryption on ScreenLock
   */
  const { db: encryptedDb, updateDb: setEncryptedDb } = DatabaseService(currentDB.vault);
  const setEncryptedCache = (data: string) => setEncryptedDb({ ...encryptedDb, data });
  const destroyEncryptedCache = () => {
    const { data, ...rest } = encryptedDb;
    setEncryptedDb({ ...rest }); // Keep the password field
  };
  const getUnlockPassword = () => encryptedDb.password;
  const setUnlockPassword = (password: string) => {
    setEncryptedDb({ ...encryptedDb, password });
  };

  const stateContext: IDataContext = {
    ...appState,
    createActions: key => ActionFactory(key, dispatch, appState),
    resetAppDb,
    removeSeedData,
    addSeedData,
    encryptedDb,
    setEncryptedCache,
    destroyEncryptedCache,
    setUnlockPassword,
    getUnlockPassword
  };

  return <DataContext.Provider value={stateContext}>{children}</DataContext.Provider>;
};
