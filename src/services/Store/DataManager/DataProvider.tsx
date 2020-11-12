import React, { createContext, useMemo } from 'react';

// import { getCurrentDBConfig, getData } from '@database';
import { getState, useSelector } from '@store';
import { DataStore } from '@types';

// import { DatabaseService } from './DatabaseService';
import { marshallStateToDataStore } from './utils';

export type IDataContext = DataStore;

export const DataContext = createContext({} as IDataContext);

export const DataProvider: React.FC = ({ children }) => {
  // const currentDB = useMemo(() => getCurrentDBConfig(), []);
  // const currentDBValues = useMemo(() => getData(), []);
  // const { db, defaultValues } = DatabaseService(
  //   currentDB.main,
  //   currentDBValues,
  //   currentDB.defaultValues
  // );

  // Temporary transformation from redux state that stores entities as objects
  // into our previous state structure with arrays. This can be removed once we
  // convert our existing calls into selectors.
  const reduxState = useSelector(getState);
  const appState = useMemo(() => marshallStateToDataStore(reduxState), [reduxState]);

  // Seed our redux store with the persistance layer.
  // useEffect(() => {
  //   dispatch(setStoreState(db));
  // }, []);

  const stateContext: IDataContext = {
    ...appState
  };

  return <DataContext.Provider value={stateContext}>{children}</DataContext.Provider>;
};
