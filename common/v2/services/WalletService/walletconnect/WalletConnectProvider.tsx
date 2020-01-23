import React, { createContext, useState } from 'react';
import WalletConnect from '@walletconnect/browser';
import { ITxData } from '@walletconnect/types';
import { WalletConnectSingleton } from './walletConnectSingleton';

type TWalletConnectSession = undefined | WalletConnect;

interface WalletConnectProviderState {
  session: TWalletConnectSession;
  fetchWalletConnectSession(): Promise<void>;
  refreshSession(): Promise<void>;
  sendTransaction(tx: ITxData): Promise<any>;
}

const initWalletConnectState = (): TWalletConnectSession => {
  const wcLocalStorage = window.localStorage.getItem('walletconnect');
  const wcSessionInfo = wcLocalStorage && JSON.parse(wcLocalStorage);
  return WalletConnectSingleton.initializeWalletConnectSession(wcSessionInfo || undefined);
};

export const WalletConnectContext = createContext({} as WalletConnectProviderState);

export const WalletConnectProvider = ({ children }: any) => {
  const [session, setSession] = useState(initWalletConnectState());
  const fetchWalletConnectSession = async () => {
    if (!session) {
      setSession(await WalletConnectSingleton.getWalletConnectSession());
    }
  };

  const refreshSession = async () => {
    setSession(await WalletConnectSingleton.refreshWalletConnectSession());
  };

  const sendTransaction = (tx: ITxData) => {
    if (!session)
      throw new Error(
        "[WalletConnectProvider]: Cannot send a transaction because session doesn't exist"
      );
    return session.sendTransaction(tx);
  };

  const stateContext: WalletConnectProviderState = {
    session,
    fetchWalletConnectSession,
    refreshSession,
    sendTransaction
  };

  return (
    <WalletConnectContext.Provider value={stateContext}>{children}</WalletConnectContext.Provider>
  );
};

export default WalletConnectProvider;
