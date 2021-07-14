import { PureComponent } from 'react';

import QRCodeLib from 'qrcode';
import styled from 'styled-components';

import Spinner from './Spinner';

// FIXME should store limited amount if history
// data -> qr cache
const cache: { [key: string]: string } = {};

interface Props {
  data: string;
}

interface State {
  qr?: string;
}

export default class QRCode extends PureComponent<Props, State> {
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
    return (
      <img
        src={qr}
        alt="QR Code"
        style={{
          width: '100%',
          height: '100%'
        }}
      />
    );
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

interface QRCodeContainerProps {
  size?: string;
  disableSpinner?: boolean;
  data?: string;
}

const SQRCodeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(props: { size: string }) => props.size};
  min-width: ${(props: { size: string }) => props.size};
  min-height: ${(props: { size: string }) => props.size};
  & img {
    border: solid white 15px;
  }
`;

export const QRCodeContainer = ({
  disableSpinner = false,
  data,
  size = '415px'
}: QRCodeContainerProps) => {
  return (
    <SQRCodeContainer size={size}>
      {!data && !disableSpinner && <Spinner />}
      {data && <QRCode data={data} />}
    </SQRCodeContainer>
  );
};
