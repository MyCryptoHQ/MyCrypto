import React from 'react';
import { connect } from 'react-redux';
import translate, { translateRaw } from 'translations';
import QrSigner from '@parity/qr-signer';
import { AppState } from 'reducers';
import Modal, { IButton } from 'components/ui/Modal';
import { TFinalize, finalize } from 'actions/paritySigner';
import './index.scss';

interface State {
  scan: boolean;
}

interface PropsClosed {
  isOpen: false;
  finalize: TFinalize;
}

interface PropsOpen {
  isOpen: true;
  rlp: string;
  from: string;
  finalize: TFinalize;
}

type Props = PropsClosed | PropsOpen;

class QrSignerModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      scan: false
    };
  }

  public render() {
    if (!this.props.isOpen) {
      return null;
    }

    const { scan } = this.state;
    const { from, rlp } = this.props;

    const buttons: IButton[] = [
      {
        disabled: false,
        text: translate(scan ? 'ACTION_4' : 'ADD_PARITY_3'),
        type: 'primary',
        onClick: () => this.setState({ scan: !scan })
      },
      {
        disabled: false,
        text: translate('ACTION_2'),
        type: 'default',
        onClick: this.onClose
      }
    ];

    return (
      <div className="QrSignerModal">
        <Modal
          title={translateRaw('DEP_SIGNTX')}
          isOpen={true}
          buttons={buttons}
          handleClose={this.onClose}
        >
          <div className="QrSignerModal-qr-bounds">
            <QrSigner size={300} scan={scan} account={from} rlp={rlp} onScan={this.onScan} />
          </div>
        </Modal>
      </div>
    );
  }

  private onClose = () => {
    if (!this.props.isOpen) {
      return;
    }

    this.props.finalize(null);
    this.setState({ scan: false });
  };

  private onScan = (signature: string) => {
    if (!this.props.isOpen) {
      return;
    }

    this.props.finalize(signature);
    this.setState({ scan: false });
  };
}

function mapStateToProps(state: AppState) {
  const { requested } = state.paritySigner;

  if (!requested) {
    return { isOpen: false };
  }

  const { from, rlp } = requested;

  return {
    isOpen: true,
    from,
    rlp
  };
}

export default connect(mapStateToProps, { finalize })(QrSignerModal);
