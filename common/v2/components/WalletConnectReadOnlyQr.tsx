import React from 'react';

import QRCode from './QRCode';
import Spinner from './Spinner';
import './WalletConnectReadOnlyQr.scss';

interface ScanProps {
  sessionUri: string;
}

export const WalletConnectReadOnlyQr = ({ sessionUri }: ScanProps) => {
  return <div>{sessionUri ? <QRCode data={sessionUri} /> : <Spinner />}</div>;
};

export default WalletConnectReadOnlyQr;
