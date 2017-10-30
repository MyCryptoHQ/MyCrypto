import Identicon from 'components/ui/Identicon';
import Modal, { IButton } from 'components/ui/Modal';
import Spinner from 'components/ui/Spinner';
import { NetworkConfig, NodeConfig } from 'config/data';
import EthTx from 'ethereumjs-tx';
import {
  BroadcastTransactionStatus,
  getTransactionFields,
  decodeTransaction
} from 'libs/transaction';
import React from 'react';
import { connect } from 'react-redux';
import {
  getLanguageSelection,
  getNetworkConfig,
  getNodeConfig
} from 'selectors/config';
import { getTokens, getTxFromState, MergedToken } from 'selectors/wallet';
import translate, { translateRaw } from 'translations';
import './ConfirmationModal.scss';

interface Props {
  signedTx: string;
  transaction: EthTx;
  node: NodeConfig;
  token: MergedToken;
  network: NetworkConfig;
  lang: string;
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
        this.setState({ timeToRead: this.state.timeToRead - 1 });
      } else {
        window.clearInterval(this.readTimer);
      }
    }, 1000);
  }

  public render() {
    const {
      node,
      token,
      network,
      onClose,
      broadCastTxStatus,
      transaction
    } = this.props;
    const { timeToRead } = this.state;
    const { toAddress, value, gasPrice, data, from, nonce } = decodeTransaction(
      transaction,
      token
    );

    const buttonPrefix = timeToRead > 0 ? `(${timeToRead}) ` : '';
    const buttons: IButton[] = [
      {
        text: buttonPrefix + translateRaw('SENDModal_Yes'),
        type: 'primary',
        disabled: timeToRead > 0,
        onClick: this.confirm
      },
      {
        text: translateRaw('SENDModal_No'),
        type: 'default',
        onClick: onClose
      }
    ];

    const symbol = token ? token.symbol : network.unit;

    const isBroadcasting =
      broadCastTxStatus && broadCastTxStatus.isBroadcasting;

    return (
      <div className="ConfModalWrap">
        <Modal
          title="Confirm Your Transaction"
          buttons={buttons}
          handleClose={onClose}
          disableButtons={isBroadcasting}
          isOpen={true}
        >
          {
            <div className="ConfModal">
              {isBroadcasting ? (
                <div className="ConfModal-loading">
                  <Spinner size="5x" />
                </div>
              ) : (
                <div>
                  <div className="ConfModal-summary">
                    <div className="ConfModal-summary-icon ConfModal-summary-icon--from">
                      <Identicon size="100%" address={from} />
                    </div>
                    <div className="ConfModal-summary-amount">
                      <div className="ConfModal-summary-amount-arrow" />
                      <div className="ConfModal-summary-amount-currency">
                        {value} {symbol}
                      </div>
                    </div>
                    <div className="ConfModal-summary-icon ConfModal-summary-icon--to">
                      <Identicon size="100%" address={toAddress} />
                    </div>
                  </div>

                  <ul className="ConfModal-details">
                    <li className="ConfModal-details-detail">
                      You are sending from <code>{from}</code>
                    </li>
                    <li className="ConfModal-details-detail">
                      You are sending to <code>{toAddress}</code>
                    </li>
                    <li className="ConfModal-details-detail">
                      You are sending with a nonce of <code>{nonce}</code>
                    </li>
                    <li className="ConfModal-details-detail">
                      You are sending{' '}
                      <strong>
                        {value} {symbol}
                      </strong>{' '}
                      with a gas price of <strong>{gasPrice} gwei</strong>
                    </li>
                    <li className="ConfModal-details-detail">
                      You are interacting with the{' '}
                      <strong>{node.network}</strong>{' '}
                      network provided by <strong>{node.service}</strong>
                    </li>
                    {!token && (
                      <li className="ConfModal-details-detail">
                        {data ? (
                          <span>
                            You are sending the following data:{' '}
                            <textarea
                              className="form-control"
                              value={data}
                              rows={3}
                              disabled={true}
                            />
                          </span>
                        ) : (
                          'There is no data attached to this transaction'
                        )}
                      </li>
                    )}
                  </ul>

                  <div className="ConfModal-confirm">
                    {translate('SENDModal_Content_3')}
                  </div>
                </div>
              )}
            </div>
          }
        </Modal>
      </div>
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

  // Network config for defaults
  const network = getNetworkConfig(state);

  const node = getNodeConfig(state);

  const lang = getLanguageSelection(state);

  const broadCastTxStatus = getTxFromState(state, props.signedTx);

  // Determine if we're sending to a token from the transaction to address
  const { to, data } = getTransactionFields(transaction);
  const tokens = getTokens(state);
  const token = data && tokens.find(t => t.address === to);

  return {
    node,
    broadCastTxStatus,
    transaction,
    token,
    network,
    lang
  };
}

export default connect(mapStateToProps)(ConfirmationModal);
