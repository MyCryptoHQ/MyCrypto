import React from 'react';
import Modal, { IButton } from 'components/ui/Modal';
import './Modals.scss';
import { NodeConfig } from 'config/data';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { getNodeConfig } from 'selectors/config';
import { Identicon } from 'components/ui';
import { getTo, getValue, getDataExists, getTransaction } from 'selectors/transaction';

const MonoTd = ({ children }) => <td className="mono">{children}</td>;

interface Props {
  // MapState
  node: NodeConfig;
  hasBroadCasted: boolean;
  toAddress: any;
  gasPrice: any;
  from: any;
  revealDate: any;
  endDate: any;
  bid: number;
  name: string;
  data: any;
  transaction: any;
  // Props
  onConfirm?: any;
  onCancel?: any;
  toggle: any;
  mask: number;
  phrase: string;
}

// TODO: types
interface State {
  timeToRead: number;
}

class BidModal extends React.Component<Props, State> {
  public state = {
    timeToRead: 5,
    hasBroadCasted: false
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
    const { node, name, bid, mask, toAddress, from, phrase, transaction } = this.props;
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
      <Modal title="Place a bid" isOpen={true} handleClose={this.onCancel} buttons={buttons}>
        <div className="Auction-warning">
          <strong>
            <h4>Screenshot & Save</h4>
          </strong>
          You cannot claim your name unless you have this information during the reveal process.
        </div>
        <section className="BidModal-summary">
          <section className="BidModal-summary-icon BidModal-summary-icon--from">
            <Identicon size="100%" address={from} />
          </section>
          <section className="BidModal-summary-amount">
            <section className="BidModal-summary-amount-arrow" />
            {mask}
          </section>
          <section className="BidModal-summary-icon BidModal-summary-icon--to">
            <Identicon size="100%" address={toAddress} />
          </section>
        </section>
        <div className="table-wrapper">
          <table className="table table-striped">
            <tbody>
              <tr>
                <td>Name: </td>
                <MonoTd>{name}.eth</MonoTd>
              </tr>
              <tr>
                <td>Bid: </td>
                <MonoTd>{bid}</MonoTd>
              </tr>
              <tr>
                <td>Bid Mask:</td>
                <MonoTd>{mask}</MonoTd>
              </tr>
              <tr>
                <td>Secret Phrase:</td>
                <MonoTd>{phrase}</MonoTd>
              </tr>
              <tr>
                <td>From:</td>
                <MonoTd>{from}</MonoTd>
              </tr>
              <tr>
                <td>Reveal Date:</td>
                <MonoTd>{'date'}</MonoTd>
              </tr>
              <tr>
                <td>Auction Ends:</td>
                <MonoTd>
                  <span>{'date'}</span>
                </MonoTd>
              </tr>
            </tbody>
          </table>
          {/* use css not br's */}
          <br />
          <p>Copy and save this:</p>
          <textarea className="form-control" readOnly={true} value={JSON.stringify(transaction)} />

          <div className="BidModal-details-detail text-center">
            You are interacting with the <strong>{node.network}</strong> network provided by{' '}
            <strong>{node.service}</strong>
          </div>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  const node = getNodeConfig(state);
  return {
    node,
    toAddress: getTo(state).raw,
    from: getTo(state).raw,
    bid: getValue(state).raw,
    data: getDataExists(state),
    transaction: getTransaction(state).transaction
  };
};

export default connect(mapStateToProps)(BidModal);
