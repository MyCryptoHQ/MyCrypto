import React, {
  createContext,
  Dispatch,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState
} from 'react';

import { getAppState, useDispatch, useSelector } from '@store';

import {
  addDevSeedToSchema,
  getCurrentDBConfig,
  getData,
  getEncryptedData,
  removeSeedDataFromSchema
} from '@database';
import { DataStore, DSKeys, EncryptedDataStore, LSKeys } from '@types';
import { useEvent, useThrottleFn } from '@vendor';

import { ActionFactory } from './actions';
import { DatabaseService } from './DatabaseService';
import { ActionY, ActionZ, EncryptedDbActionPayload, encryptedDbReducer } from './encrypt.reducer';
import { deMarshallState, marshallState } from './utils';

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
  const { db, updateDb, resetDb, defaultValues } = DatabaseService(
    currentDB.main,
    currentDBValues,
    currentDB.defaultValues
  );

  const dispatch = useDispatch();
  const reduxState = useSelector(getAppState);

  /* Temp step to sync StoreProvider with new redux */
  const [appState, setAppState] = useState(marshallState(db));
  useEffect(() => {
    setAppState(reduxState);
  }, [reduxState]);

  /* Temp step to sync redux state with localstorage */
  useEffect(() => {
    dispatch({ type: 'RESET', payload: { data: marshallState(db) } });
  }, []);

  const resetAppDb = useCallback(
    (newDb = defaultValues) => {
      resetDb(newDb); // Reset the persistence layer
      dispatch({
        type: 'RESET',
        payload: { data: marshallState(newDb) }
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
  const currentEncryptedDBValues = useMemo(() => getEncryptedData(), []);

  const { db: encryptedDb, updateDb: setEncryptedDb } = DatabaseService(
    currentDB.vault,
    currentEncryptedDBValues
  );

  const [encryptedDbState, dispatchEncryptedDb]: [
    EncryptedDataStore,
    Dispatch<ActionZ>
  ] = useReducer(encryptedDbReducer, encryptedDb);

  useEffect(() => setEncryptedDb(encryptedDbState), [encryptedDbState]);

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
      type: 'ADD_ENTRY',
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
