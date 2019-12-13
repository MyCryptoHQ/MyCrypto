import React, { useState, useEffect } from 'react';

import './WalletConnectSignQr.scss';
import { WalletConnectQrContent } from './WalletUnlock/WalletConnectProvider';
import QRCode from './QRCode';
import Spinner from './Spinner';
import WalletConnectItem from 'v2/services/WalletService/walletconnect/walletConnect';

interface ScanProps {
  scan: true;
  onScan(data: WalletConnectQrContent): void;
}

export const WalletConnectSignQr = ({ onScan }: ScanProps) => {
  const [walletConnectWallet] = useState(new WalletConnectItem());
  const [isWalletConnectSessionActive, setIsWalletConnectSessionActive] = useState(
    walletConnectWallet.getWalletConnector() ? true : false
  );
  const walletConnectorURI =
    isWalletConnectSessionActive && walletConnectWallet.getWalletConnector()
      ? walletConnectWallet.getWalletConnectorUri()
      : undefined;
  useEffect(() => {
    if (isWalletConnectSessionActive) {
      return;
    }
    setTimeout(() => {
      setIsWalletConnectSessionActive(walletConnectWallet.getWalletConnector() ? true : false);
    }, 500); // If session doesn't exist, create it. This is an async since it uses cryptography.
  });

  if (isWalletConnectSessionActive) {
    // Fetch walletConnector webhook and start watching for connection requests
    const walletConnector = walletConnectWallet.getWalletConnector();
    if (walletConnector && walletConnector.accounts && walletConnector.chainId) {
      onScan({ address: walletConnector.accounts[0], chainId: walletConnector.chainId });
    }

    walletConnector!.on('connect', (error, payload) => {
      if (error) {
        throw error;
      }
      // Determine provided accounts and chainId
      const { accounts, chainId } = payload.params[0];
      onScan({ address: accounts[0], chainId });
    });

    walletConnector!.on('session_update', (error, payload) => {
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
      {isWalletConnectSessionActive && walletConnectorURI ? (
        <QRCode data={walletConnectorURI} />
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default WalletConnectSignQr;
