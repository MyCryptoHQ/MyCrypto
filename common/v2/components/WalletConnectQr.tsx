import React, { useState, useEffect } from 'react';

import './WalletConnectQr.scss';
import { WalletConnectQrContent } from './WalletUnlock/WalletConnectProvider';
import QRCode from './QRCode';
import Spinner from './Spinner';
import WalletConnectItem from 'v2/services/WalletService/walletconnect/walletConnect';

interface ScanProps {
  scan: true;
  onScan(data: WalletConnectQrContent): void;
}

export const WalletConnectQr = ({ onScan }: ScanProps) => {
  const [walletConnectWallet] = useState(new WalletConnectItem());

  const [walletConnectSession, setWalletConnectSession] = useState(
    walletConnectWallet.getWalletConnector()
  );

  const [isInitialized, setIsInitialized] = useState(walletConnectSession ? true : false);

  useEffect(() => {
    if (isInitialized) {
      return;
    }
    if (walletConnectSession) {
      walletConnectWallet.killSession();
      setIsInitialized(true);
    } else {
      setIsInitialized(true);
    }
  });

  useEffect(() => {
    if (walletConnectSession || !isInitialized) {
      return;
    }
    setTimeout(() => {
      setWalletConnectSession(walletConnectWallet.getWalletConnector());
    }, 500);
  });

  const walletConnectorURI =
    walletConnectSession && walletConnectWallet.getWalletConnector()
      ? walletConnectWallet.getWalletConnectorUri()
      : undefined;

  if (walletConnectSession && isInitialized) {
    // Fetch walletConnector webhook and start watching for connection requests
    const walletConnector = walletConnectWallet.getWalletConnector();
    if (walletConnector) {
      walletConnector.on('connect', (error, payload) => {
        if (error) {
          throw error;
        }
        // Determine provided accounts and chainId
        const { accounts, chainId } = payload.params[0];
        // Only add the first-listed account
        setWalletConnectSession(undefined);
        walletConnectWallet.killSession();

        onScan({ address: accounts[0], chainId });
      });
    }
  }

  return (
    <div>
      {walletConnectSession && isInitialized && walletConnectorURI ? (
        <QRCode data={walletConnectorURI} />
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default WalletConnectQr;
