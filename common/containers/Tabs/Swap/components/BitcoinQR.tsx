import QRCode from 'qrcode.react';
import React, { PureComponent } from 'react';
import { translateRaw, translateMarkdown } from 'translations';

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
          <label>{translateRaw('x_Address')}</label>
          <div className="qr-code">
            <QRCode value={`bitcoin:${paymentAddress}amount=${destinationAmount}`} />
          </div>
          <br />
          <p className="text-danger">{translateRaw('SWAP_TIME_LIMIT_WARNING')}</p>
          {translateMarkdown('SWAP_RECOMMENDED_TX_FEES', {
            var_link: 'https://shapeshift.io/#/btcfee'
          })}
        </section>
      </div>
    );
  }
}
