import React, { createContext, Dispatch, useEffect, useMemo, useReducer } from 'react';

import { getAppState, initialLegacyState, useDispatch, useSelector } from '@store';

import { getCurrentDBConfig, getEncryptedData } from '@database';
import { DataStore, DSKeys, EncryptedDataStore, LSKeys } from '@types';
import { noOp } from '@utils';
import { isEmpty } from '@vendor';

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
}
export type IDataContext = DataCacheManager & EncryptedStorage;

export const DataContext = createContext({} as IDataContext);

export const DataProvider: React.FC = ({ children }) => {
  const currentDB = useMemo(() => getCurrentDBConfig(), []);

  const dispatch = useDispatch();
  const legacyState = useSelector(getAppState);

  /*
   *  Temp step to sync redux state with initial data eg. contracts, networks, nodes etc.
   *  Should really be done inside each reducer slice.
   **/
  useEffect(() => {
    // @todo: Redux remove after setting networks and contracts initial state.
    // simple hack to load them on the first visit. Once it is persisted in LS
    // redux-persist will rehydrate the state with the correct values.
    const initialState = marshallState(deMarshallState(initialLegacyState));
    if (isEmpty(legacyState.networks)) {
      dispatch({
        type: 'ADD_ENTRY',
        payload: { data: initialState.networks, model: LSKeys.NETWORKS }
      });
    }
    if (isEmpty(legacyState.networks)) {
      dispatch({
        type: 'ADD_ENTRY',
        payload: { data: initialState.contracts, model: LSKeys.CONTRACTS }
      });
    }
  }, []);

  const resetAppDb = (newDb = deMarshallState(initialLegacyState)) => {
    // resetDb(newDb); // Reset the persistence layer
    dispatch({
      type: 'RESET',
      payload: { data: marshallState(newDb) }
    }); // Reset the Context
  };

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

  const setUnlockPassword = (password: string) => {
    dispatch({
      type: 'ADD_ENTRY',
      payload: { data: password, model: LSKeys.PASSWORD }
    });
  };

  const stateContext: IDataContext = {
    ...legacyState,
    createActions: (key) => ActionFactory(key, dispatch, legacyState),
    resetAppDb,
    encryptedDbState,
    removeSeedData: noOp,
    addSeedData: noOp,
    setEncryptedCache,
    destroyEncryptedCache,
    setUnlockPassword
  };

  return <DataContext.Provider value={stateContext}>{children}</DataContext.Provider>;
};
