import React from 'react';
import { connect } from 'react-redux';
import translate, { translateRaw } from 'translations';
import EthTx from 'ethereumjs-tx';
import { transactionToRLP } from 'utils/helpers';
import QrSigner from '@parity/qr-signer';
import { AppState } from 'reducers';
import Modal, { IButton } from 'components/ui/Modal';
import './index.scss';

interface State {
  scan: boolean;
}

interface PropsClosed {
  isOpen: false;
}

interface PropsOpen {
  isOpen: true;
  from: string;
  tx: EthTx;
  onSignature(signature: string): void;
  onCancel(): void;
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
    const { tx, from } = this.props;

    const rlp = transactionToRLP(tx);
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

    this.props.onCancel();
    this.setState({ scan: false });
  };

  private onScan = (signature: string) => {
    if (!this.props.isOpen) {
      return;
    }

    this.props.onSignature(signature);
    this.setState({ scan: false });
  };
}

function mapStateToProps(state: AppState) {
  const { signViaQr } = state.wallet;

  if (!signViaQr) {
    return { isOpen: false };
  }

  const { tx, from, onSignature, onCancel } = signViaQr;

  return {
    isOpen: true,
    tx,
    from,
    onSignature,
    onCancel
  };
}

export default connect(mapStateToProps, {})(QrSignerModal);
