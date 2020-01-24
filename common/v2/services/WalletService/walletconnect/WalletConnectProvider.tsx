import React, { createContext, useReducer } from 'react';
import WalletConnect from '@walletconnect/browser';
import { ITxData } from '@walletconnect/types';
import { WalletConnectSingleton } from './walletConnectSingleton';
import { walletConnectReducer, WalletConnectState, WalletConnectServiceActions } from './reducer';

export type TWalletConnectSession = undefined | WalletConnect;

interface WalletConnectProviderState {
  session: TWalletConnectSession;
  walletUnlockState: WalletConnectQRState;
  handleReset(): void;
  fetchWalletConnectSession(): Promise<void>;
  handleUnlock(cb: any): void;
  refreshSession(): Promise<void>;
  sendTransaction(tx: ITxData): Promise<any>;
}

export enum WalletConnectQRState {
  READY, // use when walletConnect session is created
  CONNECTING, // use when walletConnect session needs to be created
  UNKNOWN // used upon component initialization when walletconnect status is not determined
}

const initWalletConnectState = (): WalletConnectState => {
  const wcLocalStorage = window.localStorage.getItem('walletconnect');
  const wcSessionInfo = wcLocalStorage && JSON.parse(wcLocalStorage);
  return {
    session: WalletConnectSingleton.initializeWalletConnectSession(wcSessionInfo || undefined),
    walletUnlockState: WalletConnectQRState.UNKNOWN
  };
};

export const WalletConnectContext = createContext({} as WalletConnectProviderState);

export const WalletConnectProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(walletConnectReducer, initWalletConnectState());

  const fetchWalletConnectSession = async () => {
    console.debug('[WalletConnectProvider]: fetchWalletConnectSession triggered');
    if (state.session) {
      dispatch({
        type: WalletConnectServiceActions.CREATE_SESSION,
        payload: {
          session: await WalletConnectSingleton.getWalletConnectSession(),
          walletUnlockState: WalletConnectQRState.READY
        }
      });
    }
  };

  const refreshSession = async () => {
    console.debug('[WalletConnectProvider]: Refreshing session');
    dispatch({
      type: WalletConnectServiceActions.REFRESH_SESSION,
      payload: {
        session: await WalletConnectSingleton.refreshWalletConnectSession(),
        walletUnlockState: WalletConnectQRState.CONNECTING
      }
    });
  };

  const changeWalletUnlockState = (newState: WalletConnectQRState) => {
    dispatch({
      type: WalletConnectServiceActions.CHANGE_WALLET_UNLOCK_STATE_REQUESTED,
      payload: {
        walletUnlockState: newState
      }
    });
  };

  const sendTransaction = (tx: ITxData) => {
    if (!state.session)
      throw new Error(
        "[WalletConnectProvider]: Cannot send a transaction because session doesn't exist"
      );
    return state.session.sendTransaction(tx);
  };

  const handleReset = () => {
    console.debug('[WalletConnectProvider]: Reset WalletConnectQRState to re-trigger session');
    changeWalletUnlockState(WalletConnectQRState.UNKNOWN);
  };

  const handleUnlock = (cb: any) => {
    if (state.walletUnlockState === WalletConnectQRState.UNKNOWN) {
      state.session ? refreshSession() : changeWalletUnlockState(WalletConnectQRState.CONNECTING);
    }
    // If a WalletConnect session already exist, or setup isnt initialized, exit.
    // Otherwise, generate a new session.
    if (state.walletUnlockState === WalletConnectQRState.CONNECTING && state.session) {
      fetchWalletConnectSession();
    }

    if (state.session && state.walletUnlockState === WalletConnectQRState.READY) {
      state.session.on('connect', (error: any, payload: any) => {
        if (error) {
          throw error;
        }
        // Determine provided accounts and chainId
        const { accounts, chainId } = payload.params[0];
        cb({ address: accounts[0], chainId });
      });
      state.session.on('session_update', (error: any, payload: any) => {
        if (error) {
          console.debug('[SignTransactionWalletConnect]: Error with session update', error);
          throw error;
        }
        // Determine provided accounts and chainId
        const { accounts, chainId } = payload.params[0];
        cb({ address: accounts[0], chainId });
      });
    }
  };

  const stateContext: WalletConnectProviderState = {
    ...state,
    fetchWalletConnectSession,
    refreshSession,
    sendTransaction,
    handleReset,
    handleUnlock
  };

  return (
    <WalletConnectContext.Provider value={stateContext}>{children}</WalletConnectContext.Provider>
  );
};

export default WalletConnectProvider;
