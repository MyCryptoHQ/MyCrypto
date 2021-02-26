import React, { createContext } from 'react';

import { getAppState, useSelector } from '@store';
import { DataStore } from '@types';

export type IDataContext = DataStore;

export const DataContext = createContext({} as IDataContext);

export const DataProvider: React.FC = ({ children }) => {
  const legacyState = useSelector(getAppState);

  const stateContext: IDataContext = {
    ...legacyState
  };

  return <DataContext.Provider value={stateContext}>{children}</DataContext.Provider>;
};
