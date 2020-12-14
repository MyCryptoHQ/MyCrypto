import React, { createContext, Dispatch, useEffect, useMemo, useReducer } from 'react';

import { getAppState, initialLegacyState, setPassword, useDispatch, useSelector } from '@store';
import { ActionT } from '@store/legacy.reducer';

import { getCurrentDBConfig, getEncryptedData } from '@database';
import { DataStore, EncryptedDataStore } from '@types';

import { DatabaseService } from './DatabaseService';
import { ActionY, ActionZ, EncryptedDbActionPayload, encryptedDbReducer } from './encrypt.reducer';

export interface DataCacheManager extends DataStore {
  resetAppDb(): void;
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

  // @todo: Redux create action for reset once legacy.reducer is replaced.
  const resetAppDb = (newDb = initialLegacyState) => {
    dispatch({
      type: ActionT.RESET,
      payload: { data: newDb }
    });
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

  const setUnlockPassword = (pwd: string) => {
    dispatch(setPassword(pwd));
  };

  const stateContext: IDataContext = {
    ...legacyState,
    resetAppDb,
    encryptedDbState,
    setEncryptedCache,
    destroyEncryptedCache,
    setUnlockPassword
  };

  return <DataContext.Provider value={stateContext}>{children}</DataContext.Provider>;
};
