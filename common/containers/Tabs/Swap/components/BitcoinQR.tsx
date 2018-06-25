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
          <label>{translate('X_ADDRESS')}</label>
          <div className="BitcoinQR-qr">
            <QRCode value={`bitcoin:${paymentAddress}amount=${destinationAmount}`} />
          </div>
          <br />
          <p className="text-danger">{translate('SWAP_TIME_LIMIT_WARNING')}</p>
          {translate('SWAP_RECOMMENDED_TX_FEES', {
            $link: 'https://shapeshift.io/#/btcfee'
          })}
        </section>
      </div>
    );
  }
}
