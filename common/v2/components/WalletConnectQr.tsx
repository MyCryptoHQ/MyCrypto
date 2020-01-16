import React, { useState, useEffect } from 'react';

import './WalletConnectQr.scss';
import { WalletConnectQrContent } from './WalletUnlock/WalletConnectProvider';
import QRCode from './QRCode';
import Spinner from './Spinner';
import WalletConnectItem from 'v2/services/WalletService/walletconnect/walletConnect';
import WalletConnect from '@walletconnect/browser';

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
  const [walletConnectWallet, setWalletConnectWallet] = useState(new WalletConnectItem());
  const [walletConnectSession, setWalletConnectSession] = useState(
    undefined as undefined | WalletConnect
  );

  // If the setup hasn't been initialized, but a WalletConnect session already exists kill it.
  useEffect(() => {
    if (walletSigningState !== WalletSigningState.UNKNOWN) {
      return;
    }
    // DETECT IF WALLETCONNECT SESSION EXISTS
    if (window.localStorage.getItem('walletconnect') || walletConnectSession) {
      walletConnectWallet.killSession().then(() => {
        setWalletSigningState(WalletSigningState.NOT_READY);
      });
    } else {
      setWalletSigningState(WalletSigningState.NOT_READY);
    }
  });

  // If a WalletConnect session already exist, or setup isnt initialized, exit.
  // Otherwise, generate a new session.
  useEffect(() => {
    if (walletSigningState !== WalletSigningState.NOT_READY || walletConnectSession) {
      return;
    }
    const walletConnectSessionInterval = setInterval(() => {
      setWalletConnectWallet(new WalletConnectItem());
      const walletConnector = walletConnectWallet.getWalletConnector();
      if (!walletConnector) return;
      setWalletConnectSession(walletConnector);
    }, 250);
    return () => clearInterval(walletConnectSessionInterval);
  });

  // Set WalletSigningState to ready if walletConnectSession exists. This renders qr code.
  useEffect(() => {
    if (!walletConnectSession) return;
    setWalletSigningState(WalletSigningState.READY);
  }, [walletConnectSession]);

  if (walletConnectSession && walletSigningState === WalletSigningState.READY) {
    walletConnectSession.on('connect', (error, payload) => {
      if (error) {
        throw error;
      }
      // Determine provided accounts and chainId
      const { accounts, chainId } = payload.params[0];
      onScan({ address: accounts[0], chainId });
    });

    walletConnectSession.on('session_update', (error, payload) => {
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
      {walletSigningState === WalletSigningState.READY && walletConnectSession ? (
        <QRCode data={walletConnectSession.uri} />
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default WalletConnectQr;
