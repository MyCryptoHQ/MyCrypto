import { useEffect } from 'react';
import { WalletConnectQRState } from 'v2/components/WalletUnlock/WalletConnectProvider';
import WalletConnect from '@walletconnect/browser';

export interface WalletConnectUnlockProps {
  walletSigningState: WalletConnectQRState;
  session: WalletConnect | undefined;
  setWalletSigningState(state: WalletConnectQRState): void;
  refreshSession(): Promise<WalletConnect>;
  fetchWalletConnectSession(): Promise<WalletConnect> | undefined;
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
      const walletConnector = fetchWalletConnectSession();
      if (!walletConnector) return;
    }, 250);
    return () => clearInterval(walletConnectSessionInterval);
  });

  // Set WalletSigningState to ready if walletConnectSession exists. This renders qr code.
  useEffect(() => {
    if (!session) return;
    setWalletSigningState(WalletConnectQRState.READY);
  }, [session]);
};
