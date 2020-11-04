import React, { createContext, Dispatch, useCallback, useEffect, useMemo, useReducer } from 'react';

import {
  addDevSeedToSchema,
  getCurrentDBConfig,
  getData,
  getEncryptedData,
  removeSeedDataFromSchema
} from '@database';
import {
  getAccounts,
  getAssets,
  getContacts,
  getContracts,
  getNetworks,
  getUserActions,
  updateAccounts,
  updateAssets,
  updateContacts,
  updateContracts,
  updateNetworks,
  updateUserActions,
  useDispatch,
  useSelector
} from '@store';
import { DataStore, DSKeys, EncryptedDataStore, LSKeys } from '@types';
import { toArray } from '@utils';
import { isEmpty, useEvent, useThrottleFn } from '@vendor';

import { ActionFactory } from './actions';
import { DatabaseService } from './DatabaseService';
import {
  ActionPayload,
  ActionT,
  ActionV,
  ActionY,
  ActionZ,
  appDataReducer,
  EncryptedDbActionPayload,
  encryptedDbReducer
} from './reducer';
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

  const reduxAccounts = useSelector(getAccounts);
  const reduxAssets = useSelector(getAssets);
  const reduxContacts = useSelector(getContacts);
  const reduxContracts = useSelector(getContracts);
  const reduxNetworks = useSelector(getNetworks);
  const reduxUserActions = useSelector(getUserActions);
  const reduxDispatch = useDispatch();
  // Sync existing db to redux store on load
  useEffect(() => {
    const {
      accounts: legacyAccounts,
      assets: legacyAssets,
      addressBook: legacyContacts,
      contracts: legacyContracts,
      networks: legacyNetworks,
      userActions: legacyUserActions
    } = appState;

    if (!isEmpty(legacyAccounts) && isEmpty(reduxAccounts)) {
      console.debug('Found legacy accounts: syncing redux with legacy');
      reduxDispatch(updateAccounts(toArray(legacyAccounts)));
    }
    if (!isEmpty(legacyAssets) && isEmpty(reduxAssets)) {
      console.debug('Found legacy assets: syncing redux with legacy');
      reduxDispatch(updateAssets(toArray(legacyAccounts)));
    }
    if (!isEmpty(legacyContacts) && isEmpty(reduxContacts)) {
      console.debug('Found legacy contacts: syncing redux with legacy');
      reduxDispatch(updateContacts(toArray(legacyContacts)));
    }
    if (!isEmpty(legacyContracts) && isEmpty(reduxContracts)) {
      console.debug('Found legacy contracts: syncing redux with legacy');
      reduxDispatch(updateContracts(toArray(legacyContracts)));
    }
    if (!isEmpty(legacyNetworks) && isEmpty(reduxNetworks)) {
      console.debug('Found legacy networks: syncing redux with legacy');
      reduxDispatch(updateNetworks(toArray(legacyNetworks)));
    }
    if (!isEmpty(legacyUserActions) && isEmpty(reduxUserActions)) {
      console.debug('Found legacy userActions: syncing redux with legacy');
      reduxDispatch(updateUserActions(toArray(legacyUserActions)));
    }
  }, []);

  // Update legacy store with redux values.
  useEffect(() => {
    console.debug('Redux Account change: syncing legacy with redux');
    dispatch({
      type: ActionT.ADD_ENTRY,
      payload: { model: LSKeys.ACCOUNTS, data: toArray(reduxAccounts) }
    });
  }, [reduxAccounts]);
  useEffect(() => {
    console.debug('Redux Asset change: syncing legacy with redux');
    dispatch({
      type: ActionT.ADD_ENTRY,
      payload: { model: LSKeys.ASSETS, data: toArray(reduxAssets) }
    });
  }, [reduxAssets]);
  useEffect(() => {
    console.debug('Redux Contacts change: syncing legacy with redux');
    dispatch({
      type: ActionT.ADD_ENTRY,
      payload: { model: LSKeys.ADDRESS_BOOK, data: toArray(reduxContacts) }
    });
  }, [reduxContacts]);
  useEffect(() => {
    console.debug('Redux Contracts change: syncing legacy with redux');
    dispatch({
      type: ActionT.ADD_ENTRY,
      payload: { model: LSKeys.CONTRACTS, data: toArray(reduxContracts) }
    });
  }, [reduxContracts]);
  useEffect(() => {
    console.debug('Redux Networks change: syncing legacy with redux');
    dispatch({
      type: ActionT.ADD_ENTRY,
      payload: { model: LSKeys.NETWORKS, data: toArray(reduxNetworks) }
    });
  }, [reduxNetworks]);
  useEffect(() => {
    console.debug('Redux UserActions change: syncing legacy with redux');
    dispatch({
      type: ActionT.ADD_ENTRY,
      payload: { model: LSKeys.USER_ACTIONS, data: toArray(reduxUserActions) }
    });
  }, [reduxUserActions]);

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
