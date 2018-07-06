import React, { PureComponent } from 'react';
import QRCode from 'qrcode.react';

import translate from 'translations';
import './BitcoinQR.scss';

interface Props {
  paymentAddress: string | null;
  destinationAmount: number;
}

export default class BitcoinQR extends PureComponent<Props, {}> {
  public render() {
    const { paymentAddress, destinationAmount } = this.props;
    return (
      <div className="BitcoinQR">
        <section className="row block swap-address text-center">
          <div className="BitcoinQR-qr">
            <QRCode value={`bitcoin:${paymentAddress}amount=${destinationAmount}`} />
          </div>
          <br />
          <p className="BitcoinQR-warning text-danger">{translate('SWAP_TIME_LIMIT_WARNING')}</p>
        </section>
      </div>
    );
  }
}
