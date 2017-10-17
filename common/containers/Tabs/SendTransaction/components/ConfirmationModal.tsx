import Big from 'bignumber.js';
import Identicon from 'components/ui/Identicon';
import Modal, { IButton } from 'components/ui/Modal';
import Spinner from 'components/ui/Spinner';
import { NetworkConfig, NodeConfig } from 'config/data';
import EthTx from 'ethereumjs-tx';
import ERC20 from 'libs/erc20';
import {
  BroadcastTransactionStatus,
  getTransactionFields
} from 'libs/transaction';
import { toTokenDisplay, toUnit } from 'libs/units';
import { IWallet } from 'libs/wallet/IWallet';
import React from 'react';
import { connect } from 'react-redux';
import { getLanguageSelection, getNetworkConfig } from 'selectors/config';
import { getTokens, getTxFromState, MergedToken } from 'selectors/wallet';
import translate, { translateRaw } from 'translations';
import './ConfirmationModal.scss';

interface Props {
  signedTx: string;
  transaction: EthTx;
  wallet: IWallet;
  node: NodeConfig;
  token: MergedToken | undefined;
  network: NetworkConfig;
  lang: string;
  broadCastTxStatus: BroadcastTransactionStatus;
  onConfirm(signedTx: string): void;
  onClose(): void;
}

interface State {
  fromAddress: string;
  timeToRead: number;
  hasBroadCasted: boolean;
}

class ConfirmationModal extends React.Component<Props, State> {
  public state = {
    fromAddress: '',
    timeToRead: 5,
    hasBroadCasted: false
  };

  private readTimer = 0;

  public componentWillReceiveProps(newProps: Props) {
    // Reload address if the wallet changes
    if (newProps.wallet !== this.props.wallet) {
      this.setWalletAddress(this.props.wallet);
    }
  }

  public componentDidUpdate() {
    if (
      this.state.hasBroadCasted &&
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

    this.setWalletAddress(this.props.wallet);
  }

  public render() {
    const { node, token, network, onClose, broadCastTxStatus } = this.props;
    const { fromAddress, timeToRead } = this.state;
    const {
      toAddress,
      value,
      gasPrice,
      data,
      nonce
    } = this.decodeTransaction();

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
                    <Identicon size="100%" address={fromAddress} />
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
                    You are sending from <code>{fromAddress}</code>
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
                    You are interacting with the <strong>{node.network}</strong>{' '}
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
    );
  }

  public componentWillUnmount() {
    window.clearInterval(this.readTimer);
  }

  private async setWalletAddress(wallet: IWallet) {
    // TODO move getAddress to saga
    const fromAddress = await wallet.getAddress();
    this.setState({ fromAddress });
  }

  private decodeTransaction() {
    const { transaction, token } = this.props;
    const { to, value, data, gasPrice, nonce } = getTransactionFields(
      transaction
    );
    let fixedValue;
    let toAddress;

    if (token) {
      const tokenData = ERC20.$transfer(data);
      fixedValue = toTokenDisplay(new Big(tokenData.value), token).toString();
      toAddress = tokenData.to;
    } else {
      fixedValue = toUnit(new Big(value, 16), 'wei', 'ether').toString();
      toAddress = to;
    }

    return {
      value: fixedValue,
      gasPrice: toUnit(new Big(gasPrice, 16), 'wei', 'gwei').toString(),
      data,
      toAddress,
      nonce
    };
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

  const lang = getLanguageSelection(state);

  const broadCastTxStatus = getTxFromState(state, props.signedTx);

  // Determine if we're sending to a token from the transaction to address
  const { to, data } = getTransactionFields(transaction);
  const tokens = getTokens(state);
  const token = data && tokens.find(t => t.address === to);

  return {
    broadCastTxStatus,
    transaction,
    token,
    network,
    lang
  };
}

export default connect(mapStateToProps)(ConfirmationModal);
