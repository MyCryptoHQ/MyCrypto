import React from 'react';
import { connect } from 'react-redux';
import translate, { translateRaw } from 'translations';
import { AppState } from 'reducers';
import { ParityQrSigner } from 'components';
import Modal, { IButton } from 'components/ui/Modal';
import { TFinalizeSignature, finalizeSignature } from 'actions/paritySigner';

interface State {
  scan: boolean;
}

interface PropsClosed {
  isOpen: false;
}

interface PropsOpen {
  isOpen: true;
  rlp: string;
  from: string;
}

interface ActionProps {
  finalizeSignature: TFinalizeSignature;
}

type Props = (PropsClosed | PropsOpen) & ActionProps;

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
            {scan ? (
              <ParityQrSigner scan={true} onScan={this.onScan} />
            ) : (
              <ParityQrSigner scan={false} account={from} rlp={rlp} />
            )}
          </div>
        </Modal>
      </div>
    );
  }

  private onClose = () => {
    if (!this.props.isOpen) {
      return;
    }

    this.props.finalizeSignature(null);
    this.setState({ scan: false });
  };

  private onScan = (signature: string) => {
    if (!this.props.isOpen) {
      return;
    }

    this.props.finalizeSignature(signature);
    this.setState({ scan: false });
  };
}

function mapStateToProps(state: AppState): PropsClosed | PropsOpen {
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

export default connect(mapStateToProps, { finalizeSignature })(QrSignerModal);
