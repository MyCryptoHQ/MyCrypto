import React, { createContext } from 'react';

import {
  appReset,
  getAppState,
  initialLegacyState,
  setPassword,
  useDispatch,
  useSelector
} from '@store';
import { DataStore } from '@types';

export interface DataCacheManager extends DataStore {
  resetAppDb(): void;
}

interface EncryptedStorage {
  setUnlockPassword(pwd: string): void;
}
export type IDataContext = DataCacheManager & EncryptedStorage;

export const DataContext = createContext({} as IDataContext);

export const DataProvider: React.FC = ({ children }) => {
  const dispatch = useDispatch();
  const legacyState = useSelector(getAppState);

  // @todo: Redux create action for reset once legacy.reducer is replaced.
  const resetAppDb = (newDb = initialLegacyState) => {
    dispatch(appReset(newDb));
  };
  const setUnlockPassword = (pwd: string) => {
    dispatch(setPassword(pwd));
  };

  const stateContext: IDataContext = {
    ...legacyState,
    resetAppDb,
    setUnlockPassword
  };

  return <DataContext.Provider value={stateContext}>{children}</DataContext.Provider>;
};
