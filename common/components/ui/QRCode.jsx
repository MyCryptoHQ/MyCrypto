// @flow
import React from 'react';
import QRCodeLib from 'qrcode';

// FIXME should store limited amount if history
// data -> qr cache
const cache: { [key: string]: string } = {};

type Props = {
  data: string
};

type State = {
  qr?: string
};

export default class QRCode extends React.Component {
  props: Props;
  state: State = {};

  componentWillMount() {
    // Start generating QR codes immediately
    this._generateQrCode(this.props.data);
  }

  componentWillReceiveProps(nextProps: Props) {
    // Regenerate QR codes if props change
    if (nextProps.data !== this.props.data) {
      this._generateQrCode(nextProps.data);
    }
  }

  _generateQrCode(value: string) {
    if (cache[value]) {
      this.setState({ qr: cache[value] });
      return;
    }
    QRCodeLib.toDataURL(
      value,
      {
        color: {
          dark: '#000',
          light: '#fff'
        },
        margin: 0,
        errorCorrectionLevel: 'H'
      },
      (err, qr) => {
        if (err) return;
        cache[value] = qr;
        this.setState({ qr });
      }
    );
  }

  render() {
    const { qr } = this.state;
    if (!qr) {
      return null;
    }
    return (
      <img
        src={qr}
        style={{
          width: '100%',
          height: '100%'
        }}
      />
    );
  }
}
