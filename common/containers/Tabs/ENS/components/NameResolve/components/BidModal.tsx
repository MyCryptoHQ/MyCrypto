import Identicon from 'components/ui/Identicon';
import Modal, { IButton } from 'components/ui/Modal';
import Spinner from 'components/ui/Spinner';
import { NodeConfig } from 'config/data';
import EthTx from 'ethereumjs-tx';
import { BroadcastTransactionStatus, decodeTransaction } from 'libs/transaction';
import React from 'react';
import { connect } from 'react-redux';
import { getNodeConfig } from 'selectors/config';
import { getTxFromState } from 'selectors/wallet';
import translate from 'translations';
import { UnitDisplay } from 'components/ui';
import { IBaseDomainRequest } from 'libs/ens';
import './BidModal.scss';

interface Props extends IBaseDomainRequest {
  signedTx: string;
  transaction: EthTx;
  node: NodeConfig;
  broadCastTxStatus: BroadcastTransactionStatus;
  onConfirm(signedTx: string): void;
  onClose(): void;
}

interface State {
  timeToRead: number;
  hasBroadCasted: boolean;
}

class ConfirmationModal extends React.Component<Props, State> {
  public state = {
    timeToRead: 5,
    hasBroadCasted: false
  };

  private readTimer = 0;

  public componentDidUpdate() {
    if (
      this.state.hasBroadCasted &&
      this.props.broadCastTxStatus &&
      !this.props.broadCastTxStatus.isBroadcasting
    ) {
      this.props.onClose();
    }
  }

  // Count down 5 seconds before allowing them to confirm
  public componentDidMount() {
    this.readTimer = window.setInterval(() => {
      if (this.state.timeToRead > 0) {
        this.setState({ timeToRead: --this.state.timeToRead });
      } else {
        window.clearInterval(this.readTimer);
      }
    }, 1000);
  }

  public render() {
    const { node, onClose, broadCastTxStatus, transaction } = this.props;
    const { timeToRead } = this.state;
    const { toAddress, gasPrice, from } = decodeTransaction(transaction, false);

    const buttonPrefix = timeToRead > 0 ? `(${timeToRead}) ` : '';
    const buttons: IButton[] = [
      {
        text: buttonPrefix + translate('SENDModal_Yes', true),
        type: 'primary',
        disabled: timeToRead > 0,
        onClick: this.confirm
      },
      {
        text: translate('SENDModal_No', true),
        type: 'default',
        onClick: onClose
      }
    ];

    const isBroadcasting = broadCastTxStatus && broadCastTxStatus.isBroadcasting;

    return (
      <section className="BidModalWrap">
        <Modal
          title="Confirm Your Transaction"
          buttons={buttons}
          handleClose={onClose}
          disableButtons={isBroadcasting}
          isOpen={true}
        >
          <section className="BidModal">
            {isBroadcasting ? (
              <section className="BidModal-loading">
                <Spinner size="5x" />
              </section>
            ) : (
              <section>
                <section className="BidModal-summary">
                  <section className="BidModal-summary-icon BidModal-summary-icon--from">
                    <Identicon size="100%" address={from} />
                  </section>
                  <section className="BidModal-summary-amount">
                    <section className="BidModal-summary-amount-arrow" />
                  </section>
                  <section className="BidModal-summary-icon BidModal-summary-icon--to">
                    <Identicon size="100%" address={toAddress} />
                  </section>
                </section>
                <ul className="BidModal-details">
                  <li className="BidModal-details-detail">Name: {this.props.name}.eth</li>
                  <li className="BidModal-details-detail">Actual Bid Amount:</li>
                  <li className="BidModal-details-detail">Bid Mask:</li>
                  <li className="BidModal-details-detail">Reveal Date:</li>
                  <li className="BidModal-details-detail">Auction Ends:</li>
                  <li className="BidModal-details-detail">
                    Gas price of{' '}
                    <strong>
                      <UnitDisplay unit={'gwei'} value={gasPrice} symbol={'gwei'} />
                    </strong>
                  </li>
                  <li className="BidModal-details-detail">
                    You are interacting with the <strong>{node.network}</strong> network provided by{' '}
                    <strong>{node.service}</strong>
                  </li>
                </ul>

                <section className="BidModal-confirm">{translate('SENDModal_Content_3')}</section>
              </section>
            )}
          </section>
        </Modal>
      </section>
    );
  }

  public componentWillUnmount() {
    window.clearInterval(this.readTimer);
  }

  private confirm = () => {
    if (this.state.timeToRead < 1) {
      this.props.onConfirm(this.props.signedTx);
      this.setState({ hasBroadCasted: true });
    }
  };
}

function mapStateToProps(state, props) {
  // Convert the signedTx to an EthTx transaction
  const transaction = new EthTx(props.signedTx);

  const node = getNodeConfig(state);
  const broadCastTxStatus = getTxFromState(state, props.signedTx);

  return {
    node,
    broadCastTxStatus,
    transaction
  };
}

export default connect(mapStateToProps)(ConfirmationModal);
