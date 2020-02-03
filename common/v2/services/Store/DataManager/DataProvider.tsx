import React, { createContext, Dispatch, useReducer, useCallback, useMemo, useEffect } from 'react';

import { LSKeys } from 'v2/types';
import { useThrottleFn, useEvent } from 'v2/vendor';
import {
  addDevSeedToSchema,
  removeSeedDataFromSchema,
  getCurrentDBConfig,
  getData
} from 'v2/database';

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
import { EncryptedDataStore, DataStoreWithPassword } from 'v2/types/store';

export interface DataCacheManager extends DataStoreWithPassword {
  createActions(k: LSKeys): ReturnType<typeof ActionFactory>;
  resetAppDb(): void;
  addSeedData(): void;
  removeSeedData(): void;
}

interface EncryptedStorage {
  encryptedDbState: any;
  setEncryptedCache(ls: string): void;
  destroyEncryptedCache(): void;
  destroyUnencryptedCache(): void;
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

  const [appState, dispatch]: [DataStoreWithPassword, Dispatch<ActionV>] = useReducer(
    appDataReducer,
    db, // Initial state
    marshallState // method to run on initial state
  );

  const [encryptedDbState, dispatchEncryptedDb]: [
    EncryptedDataStore,
    Dispatch<ActionZ>
  ] = useReducer(encryptedDbReducer, (undefined as unknown) as EncryptedDataStore);

  const resetAppDb = useCallback(
    (newDb = defaultValues) => {
      resetDb(newDb); // Reset the persistence layer
      dispatch({
        type: ActionT.RESET,
        payload: { data: marshallState(newDb) } as ActionPayload<DataStoreWithPassword>
      }); // Reset the Context
    },
    [defaultValues]
  );

  /*
   * Manage sync between appState an db
   */
  const syncDb = (state: DataStoreWithPassword) => {
    updateDb(deMarshallState(state));
  };

  useEffect(() => setEncryptedDb(encryptedDbState), [encryptedDbState]);

  useEffect(() => syncDb(appState), [appState]);

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
  const { updateDb: setEncryptedDb } = DatabaseService(currentDB.vault);
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
  const destroyUnencryptedCache = () => {
    resetAppDb();
  };
  const stateContext: IDataContext = {
    ...appState,
    createActions: key => ActionFactory(key, dispatch, appState),
    resetAppDb,
    encryptedDbState,
    removeSeedData,
    addSeedData,
    setEncryptedCache,
    destroyEncryptedCache,
    destroyUnencryptedCache,
    setUnlockPassword,
    getUnlockPassword
  };

  return <DataContext.Provider value={stateContext}>{children}</DataContext.Provider>;
};
