import React from 'react';
import Modal, { IButton } from 'components/ui/Modal';
import './Modals.scss';
import { NodeConfig } from 'config/data';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { getNodeConfig } from 'selectors/config';
import { Identicon } from 'components/ui';

const MonoTd = ({ children }) => <td className="mono">{children}</td>;

interface Props {
  onConfirm?: any;
  onCancel?: any;
  toggle: any;
  name: string;
  node: NodeConfig;
}

// TODO: types
interface State {
  timeToRead: number;
  hasBroadCasted: boolean;
  toAddress: any;
  gasPrice: any;
  from: any;
  bid: any;
  mask: any;
  revealDate: any;
  endDate: any;
}

class BidModal extends React.Component<Props, State> {
  public state = {
    timeToRead: 5,
    hasBroadCasted: false,
    toAddress: '',
    gasPrice: '',
    from: '',
    bid: '',
    mask: '',
    revealDate: '',
    endDate: ''
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
    const { timeToRead, toAddress, from, bid, mask, revealDate, endDate } = this.state;
    const { node } = this.props;
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
            <section className="BidModal-summary-amount-arrow">{mask}</section>
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
                <MonoTd>{this.props.name}.eth</MonoTd>
              </tr>
              <tr>
                <td>Actual Bid Amount: </td>
                <MonoTd>{bid}</MonoTd>
              </tr>
              <tr>
                <td>Bid Mask:</td>
                <MonoTd>{mask}</MonoTd>
              </tr>
              <tr>
                <td>Reveal Date:</td>
                <MonoTd>{revealDate}</MonoTd>
              </tr>
              <tr>
                <td>Auction Ends:</td>
                <MonoTd>
                  <span>{endDate}</span>
                </MonoTd>
              </tr>
            </tbody>
          </table>

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
    node
  };
};

export default connect(mapStateToProps)(BidModal);
