import React, { createContext } from 'react';

import { appReset, getAppState, initialLegacyState, useDispatch, useSelector } from '@store';
import { DataStore } from '@types';

export interface DataCacheManager extends DataStore {
  resetAppDb(): void;
}

export type IDataContext = DataCacheManager;

export const DataContext = createContext({} as IDataContext);

export const DataProvider: React.FC = ({ children }) => {
  const dispatch = useDispatch();
  const legacyState = useSelector(getAppState);

  // @todo: Redux create action for reset once legacy.reducer is replaced.
  const resetAppDb = (newDb = initialLegacyState) => {
    dispatch(appReset(newDb));
  };

  const stateContext: IDataContext = {
    ...legacyState,
    resetAppDb
  };

  return <DataContext.Provider value={stateContext}>{children}</DataContext.Provider>;
};
