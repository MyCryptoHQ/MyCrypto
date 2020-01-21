import React, { useState, useEffect, useContext } from 'react';

import './WalletConnectQr.scss';
import { WalletConnectQrContent } from './WalletUnlock/WalletConnectProvider';
import QRCode from './QRCode';
import Spinner from './Spinner';
import { WalletConnectContext } from 'v2/services/WalletService';

interface ScanProps {
  scan: true;
  onScan(data: WalletConnectQrContent): void;
}

enum WalletSigningState {
  READY, // use when walletConnect session is created
  NOT_READY, // use when walletConnect session needs to be created
  UNKNOWN // used upon component initialization when walletconnect status is not determined
}

export const WalletConnectQr = ({ onScan }: ScanProps) => {
  const [walletSigningState, setWalletSigningState] = useState(WalletSigningState.UNKNOWN);
  const { session, refreshSession, fetchWalletConnectSession } = useContext(WalletConnectContext);

  // If the setup hasn't been initialized, but a WalletConnect session already exists kill it.
  useEffect(() => {
    if (walletSigningState !== WalletSigningState.UNKNOWN) {
      return;
    }
    // DETECT IF WALLETCONNECT SESSION EXISTS
    if (window.localStorage.getItem('walletconnect') || session) {
      refreshSession().then(() => {
        setWalletSigningState(WalletSigningState.NOT_READY);
      });
    } else {
      setWalletSigningState(WalletSigningState.NOT_READY);
    }
  });

  // If a WalletConnect session already exist, or setup isnt initialized, exit.
  // Otherwise, generate a new session.
  useEffect(() => {
    if (walletSigningState !== WalletSigningState.NOT_READY || session) {
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
    setWalletSigningState(WalletSigningState.READY);
  }, [session]);

  if (session && walletSigningState === WalletSigningState.READY) {
    session.on('connect', (error, payload) => {
      if (error) {
        throw error;
      }
      // Determine provided accounts and chainId
      const { accounts, chainId } = payload.params[0];
      onScan({ address: accounts[0], chainId });
    });

    session.on('session_update', (error, payload) => {
      if (error) {
        throw error;
      }
      // Determine provided accounts and chainId
      const { accounts, chainId } = payload.params[0];
      onScan({ address: accounts[0], chainId });
    });
  }

  return (
    <div>
      {walletSigningState === WalletSigningState.READY && session ? (
        <QRCode data={session.uri} />
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default WalletConnectQr;
