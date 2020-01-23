import React, { createContext, useReducer } from 'react';
import WalletConnect from '@walletconnect/browser';
import { walletConnectSessionReducer, WalletConnectServiceActions } from './reducer';
import { ITxData } from '@walletconnect/types';
import { WalletConnectSingleton } from './walletConnectSingleton';

export interface WalletConnectState {
  session: undefined | WalletConnect;
}

export interface WalletConnectProviderState extends WalletConnectState {
  fetchWalletConnectSession(): Promise<void>;
  refreshSession(): Promise<void>;
  sendTransaction(tx: ITxData): Promise<any>;
}

export const initWalletConnectState = (): WalletConnectState => {
  const wcLocalStorage = window.localStorage.getItem('walletconnect');
  const wcSessionInfo = wcLocalStorage && JSON.parse(wcLocalStorage);
  return {
    session: WalletConnectSingleton.initializeWalletConnectSession(wcSessionInfo || undefined)
  };
};

export const WalletConnectContext = createContext({} as WalletConnectProviderState);

export const WalletConnectProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(walletConnectSessionReducer, initWalletConnectState());

  const fetchWalletConnectSession = async () => {
    if (!state.session) {
      dispatch({
        type: WalletConnectServiceActions.CREATE_SESSION,
        payload: {
          session: await WalletConnectSingleton.getWalletConnectSession()
        }
      });
    }
  };

  const refreshSession = async () => {
    dispatch({
      type: WalletConnectServiceActions.REFRESH_SESSION,
      payload: {
        session: await WalletConnectSingleton.refreshWalletConnectSession()
      }
    });
  };

  const sendTransaction = (tx: ITxData) => state.session.sendTransaction(tx);

  const stateContext: WalletConnectProviderState = {
    ...state,
    fetchWalletConnectSession,
    refreshSession,
    sendTransaction
  };

  return (
    <WalletConnectContext.Provider value={stateContext}>{children}</WalletConnectContext.Provider>
  );
};
