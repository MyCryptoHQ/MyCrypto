import { useEffect } from 'react';
import WalletConnect from '@walletconnect/browser';

import { WalletConnectQRState } from 'v2/components/WalletUnlock/WalletConnectProvider';

export interface WalletConnectUnlockProps {
  walletSigningState: WalletConnectQRState;
  session: WalletConnect | undefined;
  setWalletSigningState(state: WalletConnectQRState): void;
  refreshSession(): Promise<void>;
  fetchWalletConnectSession(): Promise<void>;
}

export const walletConnectUnlock = ({
  walletSigningState,
  session,
  setWalletSigningState,
  refreshSession,
  fetchWalletConnectSession
}: WalletConnectUnlockProps) => {
  useEffect(() => {
    if (walletSigningState !== WalletConnectQRState.UNKNOWN) {
      return;
    }
    // DETECT IF WALLETCONNECT SESSION EXISTS
    if (session) {
      refreshSession().then(() => {
        setWalletSigningState(WalletConnectQRState.NOT_READY);
      });
    } else {
      setWalletSigningState(WalletConnectQRState.NOT_READY);
    }
  });

  // If a WalletConnect session already exist, or setup isnt initialized, exit.
  // Otherwise, generate a new session.
  useEffect(() => {
    if (walletSigningState !== WalletConnectQRState.NOT_READY || session) {
      return;
    }
    const walletConnectSessionInterval = setInterval(() => {
      fetchWalletConnectSession().then(() => {
        return;
      });
    }, 250);
    return () => clearInterval(walletConnectSessionInterval);
  });

  // Set WalletSigningState to ready if walletConnectSession exists. This renders qr code.
  useEffect(() => {
    if (!session) return;
    setWalletSigningState(WalletConnectQRState.READY);
  }, [session]);
};
