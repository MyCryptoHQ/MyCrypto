import React from 'react';
import Modal, { IButton } from 'components/ui/Modal';
import './Modals.scss';
import { Identicon, UnitDisplay } from 'components/ui';
import {
  BroadcastTransactionStatus,
  decodeTransaction
} from 'libs/transaction';
import { NodeConfig } from 'config/data';
import EthTx from 'ethereumjs-tx';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { getNodeConfig } from 'selectors/config';
import { getTxFromState } from 'selectors/wallet';

interface Props {
  onConfirm?: any;
  onCancel?: any;
  toggle: any;
  name: string;
  node: NodeConfig;
  broadCastTxStatus: any;
}

interface State {
  timeToRead: number;
  hasBroadCasted: boolean;
}

class NewBidModal extends React.Component<Props, State> {
  public state = {
    timeToRead: 5,
    hasBroadCasted: false,
    transaction: null
  };

  private readTimer = 0;

  public componentDidMount() {
    // Count down 5 seconds before allowing them to confirm
    this.readTimer = window.setInterval(() => {
      if (this.state.timeToRead > 0) {
        this.setState({ timeToRead: --this.state.timeToRead });
      } else {
        window.clearInterval(this.readTimer);
      }
    }, 1000);
  }

  public componentWillUnmount() {
    window.clearInterval(this.readTimer);
  }

  public onCancel = () => {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
    this.props.toggle();
  };

  public onConfirm = () => {
    if (this.props.onConfirm) {
      this.props.onConfirm();
    }
    this.props.toggle();
  };

  public render() {
    const { timeToRead } = this.state;
    const { node } = this.props;
    // const { toAddress, gasPrice, from } = decodeTransaction(transaction, false);
    const buttonPrefix = timeToRead > 0 ? `(${timeToRead}) ` : '';
    const buttons: IButton[] = [
      {
        text: `${buttonPrefix} Place Bid`,
        type: 'primary',
        onClick: this.onConfirm,
        disabled: timeToRead > 0
      },
      { text: 'Cancel', type: 'default', onClick: this.onCancel }
    ];
    return (
      <Modal
        title="Place a bid"
        isOpen={true}
        handleClose={this.onCancel}
        buttons={buttons}
      >
        {/* <section className="BidModal-summary">
          <section className="BidModal-summary-icon BidModal-summary-icon--from">
            <Identicon size="100%" address={from} />
          </section>
          <section className="BidModal-summary-amount">
            <section className="BidModal-summary-amount-arrow" />
          </section>
          <section className="BidModal-summary-icon BidModal-summary-icon--to">
            <Identicon size="100%" address={toAddress} />
          </section>
        </section> */}
        <ul className="BidModal-details">
          <li className="BidModal-details-detail">
            Name: {this.props.name}.eth
          </li>
          <li className="BidModal-details-detail">Actual Bid Amount:</li>
          <li className="BidModal-details-detail">Bid Mask:</li>
          <li className="BidModal-details-detail">Reveal Date:</li>
          <li className="BidModal-details-detail">Auction Ends:</li>
          {/* <li className="BidModal-details-detail">
            Gas price of{' '}
            <strong>
              <UnitDisplay unit={'gwei'} value={gasPrice} symbol={'gwei'} />
            </strong>
          </li> */}
          <li className="BidModal-details-detail">
            You are interacting with the <strong>{node.network}</strong> network
            provided by <strong>{node.service}</strong>
          </li>
        </ul>
      </Modal>
    );
  }
}

const mapStateToProps = (state: AppState, props) => {
  const node = getNodeConfig(state);
  const broadCastTxStatus = getTxFromState(state, props.signedTx);

  return {
    node,
    broadCastTxStatus
  };
};

export default connect(mapStateToProps)(NewBidModal);
