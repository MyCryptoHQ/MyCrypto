import QRCodeLib from 'qrcode';
import React from 'react';

// FIXME should store limited amount if history
// data -> qr cache
const cache: { [key: string]: string } = {};

interface Props {
  data: string;
  className?: string;
}

interface State {
  qr?: string;
}

export default class QRCode extends React.PureComponent<Props, State> {
  public state: State = {};
  public UNSAFE_componentWillMount() {
    // Start generating QR codes immediately
    this.generateQrCode(this.props.data);
  }

  public UNSAFE_componentWillReceiveProps(nextProps: Props) {
    // Regenerate QR codes if props change
    if (nextProps.data !== this.props.data) {
      this.generateQrCode(nextProps.data);
    }
  }

  public render() {
    const { qr } = this.state;
    if (!qr) {
      return null;
    }
    const { className } = this.props;
    return <img className={className} src={qr} alt="QR Code" />;
  }

  private generateQrCode(value: string) {
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
        if (err) {
          return;
        }
        cache[value] = qr;
        this.setState({ qr });
      }
    );
  }
}
