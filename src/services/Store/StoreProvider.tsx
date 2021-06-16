import React, { createContext } from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface State {}
export const StoreContext = createContext({} as State);

// App Store that combines all data values required by the components such
// as accounts, currentAccount, tokens, and fiatValues etc.
export const StoreProvider: React.FC = ({ children }) => {
  const state: State = {};

  return <StoreContext.Provider value={state}>{children}</StoreContext.Provider>;
};

export default StoreProvider;
