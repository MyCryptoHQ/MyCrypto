import React from 'react';
import classnames from 'classnames';
import QrSigner from '@parity/qr-signer';

import translate from 'v2/translations';
import { Spinner } from 'v2/components';
import './ParityQrSigner.scss';

interface State {
  webcamError: null | React.ReactElement<any>;
  isLoading: boolean;
}

interface ScanProps {
  scan: true;
  onScan(data: string): void;
}

interface ShowProps {
  scan: false;
  account: string;
  data?: string;
  rlp?: string;
}

interface SharedProps {
  size?: number;
}

type Props = (ScanProps | ShowProps) & SharedProps;

export default class ParityQrSigner extends React.PureComponent<Props, State> {
  public state: State = {
    webcamError: null,
    isLoading: true
  };

  public componentDidMount() {
    this.checkForWebcam();
    if (navigator.mediaDevices) {
      navigator.mediaDevices.addEventListener('devicechange', this.checkForWebcam);
    }
  }

  public componentWillUnmount() {
    if (navigator.mediaDevices && navigator.mediaDevices.ondevicechange) {
      navigator.mediaDevices.removeEventListener('devicechange', this.checkForWebcam);
    }
  }

  public checkForWebcam = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        this.setState({
          webcamError: null,
          isLoading: false
        });
      } catch (e) {
        const err = e as DOMException;
        let errorMessage;
        switch (err.name) {
          case 'NotAllowedError':
          case 'SecurityError':
            errorMessage = translate('ADD_PARITY_ERROR_DISABLED');
            break;
          case 'NotFoundError':
          case 'OverconstrainedError':
            errorMessage = translate('ADD_PARITY_ERROR_NO_CAM');
            break;
          default:
            errorMessage = translate('ADD_PARITY_ERROR_UNKNOWN');
        }
        this.setState({
          webcamError: errorMessage,
          isLoading: false
        });
      }
    }
  };

  public render() {
    const { webcamError, isLoading } = this.state;
    const size = this.props.size || 300;

    return (
      <div
        className={classnames({
          ParityQrSigner: true,
          'is-disabled': !!webcamError || isLoading
        })}
        style={{
          width: size,
          height: size
        }}
      >
        {isLoading ? (
          <div className="ParityQrSigner-loader">
            <Spinner size="x3" light={true} />
          </div>
        ) : webcamError ? (
          <div className="ParityQrSigner-error">
            <i className="ParityQrSigner-error-icon fa fa-exclamation-circle" />
            {webcamError}
          </div>
        ) : (
          <QrSigner {...this.props} size={size} />
        )}
      </div>
    );
  }
}
