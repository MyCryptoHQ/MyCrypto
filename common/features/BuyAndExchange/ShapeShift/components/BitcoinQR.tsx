// Legacy
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
      <section className="BitcoinQR">
        <section className="row block swap-address text-center">
          <section className="BitcoinQR-qr">
            <QRCode value={`bitcoin:${paymentAddress}amount=${destinationAmount}`} />
          </section>

          <p className="BitcoinQR-warning">{translate('SWAP_TIME_LIMIT_WARNING')}</p>
        </section>
      </section>
    );
  }
}
