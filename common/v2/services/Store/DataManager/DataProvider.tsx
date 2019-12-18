import React, { createContext, Dispatch, useReducer, useCallback } from 'react';

import { DataStore, LSKeys } from 'v2/types';
import { useThrottleFn, useLocalStorage, useEvent } from 'v2/vendor';
import { addDevSeedToSchema, removeSeedDataFromSchema } from 'v2/database';
import { ENCRYPTED_STORAGE_KEY } from './constants';
import { appDataReducer, ActionV, ActionT, ActionPayload } from './reducer';
import { ActionFactory } from './actions';
import { deMarshallState, marshallState } from './utils';
import { useDatabase } from './useDatabase';

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
  const { db, setDb, resetDb, defaultSchema } = useDatabase();

  const [appState, dispatch]: [DataStore, Dispatch<ActionV>] = useReducer(
    appDataReducer,
    db, // Initial state
    marshallState // method to run on initial state
  );

  const resetAppDb = useCallback(
    (newDb = defaultSchema) => {
      resetDb(newDb); // Reset the persistence layer
      dispatch({
        type: ActionT.RESET,
        payload: { data: marshallState(newDb) } as ActionPayload<DataStore>
      }); // Reset the Context
    },
    [defaultSchema]
  );

  /*
   * Manage sync between appState an db
   */
  const syncDb = useCallback(() => {
    console.debug('Updating LocalStorage');
    setDb(deMarshallState(appState));
  }, [appState]);
  // By default we sync no more than once a minute
  useThrottleFn(syncDb, 60000, [appState]);
  // In any case we sync before the tab is closed
  useEvent('beforeunload', syncDb);

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
  const [encryptedDb, setEncryptedDb] = useLocalStorage(ENCRYPTED_STORAGE_KEY);
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
