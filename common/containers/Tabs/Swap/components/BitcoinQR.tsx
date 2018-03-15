import QRCode from 'qrcode.react';
import React, { PureComponent } from 'react';
import translate from 'translations';

interface Props {
  paymentAddress: string | null;
  destinationAmount: number;
}

export default class BitcoinQR extends PureComponent<Props, {}> {
  public render() {
    const { paymentAddress, destinationAmount } = this.props;
    return (
      <div>
        <section className="row block swap-address text-center">
          <label>{translate('x_Address')}</label>
          <div className="qr-code">
            <QRCode value={`bitcoin:${paymentAddress}amount=${destinationAmount}`} />
          </div>
          <br />
          <p className="text-danger">{translate('SWAP_TIME_LIMIT_WARNING')}</p>
          {translate(
            'SWAP_RECOMMENDED_TX_FEES',
            {
              $link: 'https://shapeshift.io/#/btcfee'
            },
            true
          )}
        </section>
      </div>
    );
  }
}
