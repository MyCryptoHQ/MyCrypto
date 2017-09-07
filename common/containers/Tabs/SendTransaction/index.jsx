// @flow
import React from 'react';
// UTILS
import { formatGasLimit } from 'utils/formatters';
import translate from 'translations';
import pickBy from 'lodash/pickBy';
// SELECTORS
import { getNodeConfig } from 'selectors/config';
import {
  getNodeLib,
  getNetworkConfig,
  getGasPriceGwei
} from 'selectors/config';
import {
  getTokenBalances,
  getTxFromBroadcastTransactionStatus
} from 'selectors/wallet';
import { getTokens } from 'selectors/wallet';
import type { TokenBalance } from 'selectors/wallet';
// COMPONENTS
import { UnlockHeader } from 'components/ui';
import {
  Donate,
  DataField,
  CustomMessage,
  GasField,
  AmountField,
  AddressField,
  ConfirmationModal
} from './components';
import { BalanceSidebar } from 'components';
// CONFIG
import type { NodeConfig } from 'config/data';
import type { Token, NetworkConfig } from 'config/data';
import { donationAddressMap } from 'config/data';
// REDUX
import { connect } from 'react-redux';
import type { State as AppState } from 'reducers';
import { broadcastTx } from 'actions/wallet';
import type { BroadcastTxRequestedAction } from 'actions/wallet';
import { showNotification } from 'actions/notifications';
import type { ShowNotificationAction } from 'actions/notifications';
// LIBS
import BaseWallet from 'libs/wallet/base';
import { isValidETHAddress } from 'libs/validators';
import type { RPCNode } from 'libs/nodes';
import type {
  BroadcastTransactionStatus,
  TransactionInput,
  CompleteTransaction
} from 'libs/transaction';
import type { TransactionWithoutGas } from 'libs/messages';
import type { UNIT } from 'libs/units';
import { toWei } from 'libs/units';
import {
  generateCompleteTransaction,
  getBalanceMinusGasCosts,
  formatTxInput
} from 'libs/transaction';
// MISC
import customMessages from './messages';
import Big from 'bignumber.js';

type State = {
  hasQueryString: boolean,
  readOnly: boolean,
  to: string,
  // amount value
  value: string,
  // $FlowFixMe - Comes from getParam not validating unit
  unit: UNIT,
  token: ?Token,
  gasLimit: string,
  data: string,
  gasChanged: boolean,
  transaction: ?CompleteTransaction,
  showTxConfirm: boolean,
  generateDisabled: boolean
};

function getParam(query: { [string]: string }, key: string) {
  const keys = Object.keys(query);
  const index = keys.findIndex(k => k.toLowerCase() === key.toLowerCase());
  if (index === -1) {
    return null;
  }
  return query[keys[index]];
}

type Props = {
  location: {
    query: {
      [string]: string
    }
  },
  wallet: BaseWallet,
  balance: Big,
  node: NodeConfig,
  nodeLib: RPCNode,
  network: NetworkConfig,
  tokens: Token[],
  tokenBalances: TokenBalance[],
  gasPrice: string,
  broadcastTx: (signedTx: string) => BroadcastTxRequestedAction,
  showNotification: (
    level: string,
    msg: string,
    duration?: number
  ) => ShowNotificationAction,
  transactions: Array<BroadcastTransactionStatus>
};

const initialState = {
  hasQueryString: false,
  readOnly: false,
  to: '',
  value: '',
  unit: 'ether',
  token: null,
  gasLimit: '21000',
  data: '',
  gasChanged: false,
  showTxConfirm: false,
  transaction: null,
  generateDisabled: true
};

export class SendTransaction extends React.Component {
  props: Props;
  state: State = initialState;

  componentDidMount() {
    const queryPresets = pickBy(this.parseQuery());
    if (Object.keys(queryPresets).length) {
      this.setState({ ...queryPresets, hasQueryString: true });
    }
  }

  componentDidUpdate(_prevProps: Props, prevState: State) {
    // TODO listen to gas price changes here
    // TODO debounce the call
    if (
      // if gas has not changed
      !this.state.gasChanged &&
      // if we have valid tx
      this.isValid() &&
      // if any relevant fields changed
      (this.state.to !== prevState.to ||
        this.state.value !== prevState.value ||
        this.state.unit !== prevState.unit ||
        this.state.data !== prevState.data)
    ) {
      if (!isNaN(parseInt(this.state.value))) {
        this.estimateGas();
      }
    }
    if (this.state.generateDisabled === this.isValid()) {
      this.setState({ generateDisabled: !this.isValid() });
    }
    const componentStateTransaction = this.state.transaction;
    if (componentStateTransaction) {
      // lives in redux state
      const currentTxAsSignedTransaction = getTxFromBroadcastTransactionStatus(
        this.props.transactions,
        componentStateTransaction.signedTx
      );
      // if there is a matching tx in redux state
      if (currentTxAsSignedTransaction) {
        // if the broad-casted transaction attempt is successful, clear the form
        if (currentTxAsSignedTransaction.successfullyBroadcast) {
          this.resetTx();
        }
      }
    }
  }

  render() {
    const unlocked = !!this.props.wallet;
    const {
      to,
      value,
      unit,
      gasLimit,
      data,
      readOnly,
      hasQueryString,
      showTxConfirm,
      transaction
    } = this.state;
    const customMessage = customMessages.find(m => m.to === to);

    return (
      <section className="Tab-content">
        <UnlockHeader title={'NAV_SendEther'} />

        <div className="row">
          {/* Send Form */}
          {unlocked &&
            <main className="col-sm-8">
              <div className="Tab-content-pane">
                {hasQueryString &&
                  <div className="alert alert-info">
                    <p>
                      {translate('WARN_Send_Link')}
                    </p>
                  </div>}

                <AddressField
                  placeholder={donationAddressMap.ETH}
                  value={this.state.to}
                  onChange={readOnly ? null : this.onAddressChange}
                />
                <AmountField
                  value={value}
                  unit={unit}
                  tokens={this.props.tokenBalances
                    .filter(token => !token.balance.eq(0))
                    .map(token => token.symbol)
                    .sort()}
                  onChange={readOnly ? void 0 : this.onAmountChange}
                />
                <GasField
                  value={gasLimit}
                  onChange={readOnly ? void 0 : this.onGasChange}
                />
                {unit === 'ether' &&
                  <DataField
                    value={data}
                    onChange={readOnly ? void 0 : this.onDataChange}
                  />}
                <CustomMessage message={customMessage} />

                <div className="row form-group">
                  <div className="col-xs-12 clearfix">
                    <button
                      disabled={this.state.generateDisabled}
                      className="btn btn-info btn-block"
                      onClick={this.generateTxFromState}
                    >
                      {translate('SEND_generate')}
                    </button>
                  </div>
                </div>

                {transaction &&
                  <div>
                    <div className="row form-group">
                      <div className="col-sm-6">
                        <label>
                          {translate('SEND_raw')}
                        </label>
                        <textarea
                          className="form-control"
                          value={transaction.rawTx}
                          rows="4"
                          readOnly
                        />
                      </div>
                      <div className="col-sm-6">
                        <label>
                          {translate('SEND_signed')}
                        </label>
                        <textarea
                          className="form-control"
                          value={transaction.signedTx}
                          rows="4"
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <button
                        className="btn btn-primary btn-block col-sm-11"
                        disabled={!this.state.transaction}
                        onClick={this.openTxModal}
                      >
                        {translate('SEND_trans')}
                      </button>
                    </div>
                  </div>}
              </div>
            </main>}

          {/* Sidebar */}
          {unlocked &&
            <section className="col-sm-4">
              <div className="Tab-content-pane">
                <div>
                  <BalanceSidebar />
                  <hr />
                  <Donate onDonate={this.onNewTx} />
                </div>
              </div>
            </section>}
        </div>

        {transaction &&
          showTxConfirm &&
          <ConfirmationModal
            wallet={this.props.wallet}
            node={this.props.node}
            signedTx={transaction.signedTx}
            onClose={this.hideConfirmTx}
            onConfirm={this.confirmTx}
          />}
      </section>
    );
  }

  parseQuery() {
    const query = this.props.location.query;
    const to = getParam(query, 'to');
    const data = getParam(query, 'data');
    // FIXME validate token against presets
    const unit = getParam(query, 'tokenSymbol');
    const value = getParam(query, 'value');
    let gasLimit = getParam(query, 'gas');
    if (gasLimit === null) {
      gasLimit = getParam(query, 'limit');
    }
    const readOnly = getParam(query, 'readOnly') != null;
    return { to, data, value, unit, gasLimit, readOnly };
  }

  isValid() {
    const { to, value, gasLimit } = this.state;
    return (
      isValidETHAddress(to) &&
      value &&
      Number(value) > 0 &&
      !isNaN(Number(value)) &&
      isFinite(Number(value)) &&
      !isNaN(parseInt(gasLimit)) &&
      isFinite(parseInt(gasLimit))
    );
  }

  async getFormattedTxFromState(): Promise<TransactionWithoutGas> {
    const { wallet } = this.props;
    const { token, unit, value, to, data } = this.state;
    const transactionInput: TransactionInput = {
      token,
      unit,
      value,
      to,
      data
    };
    return await formatTxInput(wallet, transactionInput);
  }

  async estimateGas() {
    if (isNaN(parseInt(this.state.value))) {
      return;
    }
    try {
      const cachedFormattedTx = await this.getFormattedTxFromState();
      // Grab a reference to state. If it has changed by the time the estimateGas
      // call comes back, we don't want to replace the gasLimit in state.
      const state = this.state;
      const gasLimit = await this.props.nodeLib.estimateGas(cachedFormattedTx);
      if (this.state === state) {
        this.setState({ gasLimit: formatGasLimit(gasLimit, state.unit) });
      } else {
        // state has changed, so try again from the start (with the hope that state won't change by the next time)
        this.estimateGas();
      }
    } catch (error) {
      this.props.showNotification('danger', error.message, 5000);
    }
  }

  // FIXME use mkTx instead or something that could take care of default gas/data and whatnot,
  onNewTx = (
    address: string,
    amount: string,
    unit: string,
    data: string = '',
    gasLimit: string = '21000'
  ) => {
    this.setState({
      to: address,
      value: amount,
      unit,
      data,
      gasLimit,
      gasChanged: false
    });
  };

  onAddressChange = (value: string) => {
    this.setState({
      to: value
    });
  };

  onDataChange = (value: string) => {
    if (this.state.unit === 'ether') {
      this.setState({ data: value });
    }
  };

  onGasChange = (value: string) => {
    this.setState({ gasLimit: value, gasChanged: true });
  };

  onAmountChange = (value: string, unit: string) => {
    if (value === 'everything') {
      if (unit === 'ether') {
        const { balance, gasPrice } = this.props;
        const { gasLimit } = this.state;
        const weiBalance = toWei(balance, 'ether');
        value = getBalanceMinusGasCosts(
          new Big(gasLimit),
          new Big(gasPrice),
          weiBalance
        );
      } else {
        const tokenBalance = this.props.tokenBalances.find(
          tokenBalance => tokenBalance.symbol === unit
        );
        if (!tokenBalance) {
          return;
        }
        value = tokenBalance.balance.toString();
      }
    }
    let token = this.props.tokens.find(x => x.symbol === unit);
    this.setState({
      value,
      unit,
      token
    });
  };

  generateTxFromState = async () => {
    const { nodeLib, wallet, gasPrice, network } = this.props;
    const { token, unit, value, to, data, gasLimit } = this.state;
    const chainId = network.chainId;
    const transactionInput = {
      token,
      unit,
      value,
      to,
      data
    };
    try {
      const signedTx = await generateCompleteTransaction(
        wallet,
        nodeLib,
        gasPrice,
        gasLimit,
        chainId,
        transactionInput
      );
      this.setState({ transaction: signedTx });
    } catch (err) {
      this.props.showNotification('danger', err.message, 5000);
    }
  };

  openTxModal = () => {
    this.setState({ showTxConfirm: true });
  };

  hideConfirmTx = () => {
    this.setState({ showTxConfirm: false });
  };

  resetTx = () => {
    this.setState({
      to: '',
      value: '',
      transaction: null
    });
  };

  confirmTx = (signedTx: string) => {
    this.props.broadcastTx(signedTx);
  };
}

function mapStateToProps(state: AppState) {
  return {
    wallet: state.wallet.inst,
    balance: state.wallet.balance,
    tokenBalances: getTokenBalances(state),
    node: getNodeConfig(state),
    nodeLib: getNodeLib(state),
    network: getNetworkConfig(state),
    tokens: getTokens(state),
    gasPrice: toWei(new Big(getGasPriceGwei(state)), 'gwei').toString(),
    transactions: state.wallet.transactions
  };
}

export default connect(mapStateToProps, { showNotification, broadcastTx })(
  SendTransaction
);
