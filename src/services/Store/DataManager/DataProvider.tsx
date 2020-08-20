import React, { createContext, Dispatch, useReducer, useCallback, useMemo, useEffect } from 'react';

import { EncryptedDataStore, DataStore, LSKeys, DSKeys } from '@types';
import { useThrottleFn, useEvent } from '@vendor';
import {
  addDevSeedToSchema,
  removeSeedDataFromSchema,
  getCurrentDBConfig,
  getData,
  getEncryptedData
} from '@database';

import {
  appDataReducer,
  ActionV,
  ActionT,
  ActionPayload,
  encryptedDbReducer,
  ActionZ,
  ActionY,
  EncryptedDbActionPayload
} from './reducer';
import { ActionFactory } from './actions';
import { deMarshallState, marshallState } from './utils';
import { DatabaseService } from './DatabaseService';

export interface DataCacheManager extends DataStore {
  createActions(k: DSKeys): ReturnType<typeof ActionFactory>;
  resetAppDb(): void;
  addSeedData(): void;
  removeSeedData(): void;
}

interface EncryptedStorage {
  encryptedDbState?: EncryptedDataStore;
  setEncryptedCache(ls: string): void;
  destroyEncryptedCache(): void;
  setUnlockPassword(pwd: string): void;
  getUnlockPassword(): string;
}
export type IDataContext = DataCacheManager & EncryptedStorage;

export const DataContext = createContext({} as IDataContext);

const isSafari = () => /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

export const DataProvider: React.FC = ({ children }) => {
  /*
   *  Create the our master store, sync with persistance layer,
   *  Provide lj
   */
  const currentDB = useMemo(() => getCurrentDBConfig(), []);
  const currentDBValues = useMemo(() => getData(), []);
  const currentEncryptedDBValues = useMemo(() => getEncryptedData(), []);
  const { db, updateDb, resetDb, defaultValues } = DatabaseService(
    currentDB.main,
    currentDBValues,
    currentDB.defaultValues
  );
  const { db: encryptedDb, updateDb: setEncryptedDb } = DatabaseService(
    currentDB.vault,
    currentEncryptedDBValues
  );

  const [appState, dispatch]: [DataStore, Dispatch<ActionV>] = useReducer(
    appDataReducer,
    db, // Initial state
    marshallState // method to run on initial state
  );

  const [encryptedDbState, dispatchEncryptedDb]: [
    EncryptedDataStore,
    Dispatch<ActionZ>
  ] = useReducer(encryptedDbReducer, encryptedDb);

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
    updateDb(deMarshallState(state));
  };

  useEffect(() => setEncryptedDb(encryptedDbState), [encryptedDbState]);

  // observe password changes in appState
  useEffect(() => syncDb(appState), [appState.password]);

  // By default we sync no more than once a 30 seconds
  useThrottleFn(syncDb, 30000, [appState]);
  // In any case, we sync before the tab is closed
  // https://developers.google.com/web/updates/2018/07/page-lifecycle-api
  useEvent('visibilitychange', () => {
    if (document.hidden) {
      syncDb(appState);
    }
  });

  // Workaround, since Safari does not trigger 'visibilitychange' event on page reload
  // Meaning all changes are lost, if db wasn't synced in 30sec window
  useEvent('beforeunload', () => {
    if (isSafari()) {
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
  const setEncryptedCache = (data: string) => {
    dispatchEncryptedDb({
      type: ActionY.SET_DATA,
      payload: { data } as EncryptedDbActionPayload<string>
    });
  };
  const destroyEncryptedCache = () => {
    dispatchEncryptedDb({
      type: ActionY.CLEAR_DATA,
      payload: {} as EncryptedDbActionPayload<string>
    });
  };
  const getUnlockPassword = () => {
    return db && db.password;
  };
  const setUnlockPassword = (password: string) => {
    dispatch({
      type: ActionT.ADD_ENTRY,
      payload: { data: password, model: LSKeys.PASSWORD }
    });
  };

  const stateContext: IDataContext = {
    ...appState,
    createActions: (key) => ActionFactory(key, dispatch, appState),
    resetAppDb,
    encryptedDbState,
    removeSeedData,
    addSeedData,
    setEncryptedCache,
    destroyEncryptedCache,
    setUnlockPassword,
    getUnlockPassword
  };

  return <DataContext.Provider value={stateContext}>{children}</DataContext.Provider>;
};
