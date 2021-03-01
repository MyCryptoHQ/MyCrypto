import React, { createContext } from 'react';

import { DataStore } from '@types';

export type IDataContext = DataStore;

export const DataContext = createContext({});

export const DataProvider: React.FC = ({ children }) => {
  return <DataContext.Provider value={{}}>{children}</DataContext.Provider>;
};
