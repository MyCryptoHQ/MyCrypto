// @flow

import React from 'react';
import translate from 'translations';
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
import pickBy from 'lodash/pickBy';
import type { State as AppState } from 'reducers';
import { connect } from 'react-redux';
import BaseWallet from 'libs/wallet/base';
// import type { Transaction } from './types';
import customMessages from './messages';
import { donationAddressMap } from 'config/data';
import { isValidETHAddress } from 'libs/validators';
import { toUnit } from 'libs/units';
import {
  getNodeLib,
  getNetworkConfig,
  getGasPriceGwei
} from 'selectors/config';
import { getTokens } from 'selectors/wallet';
import type { Token, NetworkConfig } from 'config/data';
import Big from 'bignumber.js';
import { valueToHex } from 'libs/values';
import ERC20 from 'libs/erc20';
import type { TokenBalance } from 'selectors/wallet';
import {
  getTokenBalances,
  getTxFromBroadcastStatusTransactions
} from 'selectors/wallet';
import type { RPCNode } from 'libs/nodes';
import { broadcastTx } from 'actions/wallet';
import type { BroadcastTxRequestedAction } from 'actions/wallet';
import type { BroadcastStatusTransaction } from 'libs/transaction';
import type {
  TransactionWithoutGas,
  BroadcastTransaction
} from 'libs/transaction';
import type { UNIT } from 'libs/units';
import { toWei, toTokenUnit } from 'libs/units';
import { formatGasLimit } from 'utils/formatters';
import { showNotification } from 'actions/notifications';
import type { ShowNotificationAction } from 'actions/notifications';
import type { NodeConfig } from 'config/data';
import { getNodeConfig } from 'selectors/config';
import { generateTransaction, getBalanceMinusGasCosts } from 'libs/transaction';

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
  transaction: ?BroadcastTransaction,
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

// TODO query string
// TODO how to handle DATA?

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
  gasPrice: number,
  broadcastTx: (signedTx: string) => BroadcastTxRequestedAction,
  showNotification: (
    level: string,
    msg: string,
    duration?: number
  ) => ShowNotificationAction,
  transactions: Array<BroadcastStatusTransaction>
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
    if (this.state.generateDisabled !== !this.isValid()) {
      this.setState({ generateDisabled: !this.isValid() });
    }

    const componentStateTransaction = this.state.transaction;
    if (componentStateTransaction) {
      // lives in redux state
      const currentTxAsBroadcastTransaction = getTxFromBroadcastStatusTransactions(
        this.props.transactions,
        componentStateTransaction.signedTx
      );
      // if there is a matching tx in redux state
      if (currentTxAsBroadcastTransaction) {
        // if the broad-casted transaction attempt is successful, clear the form
        if (currentTxAsBroadcastTransaction.successfullyBroadcast) {
          this.resetTransaction();
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
      <section className="container" style={{ minHeight: '50%' }}>
        <div className="tab-content">
          <main className="tab-pane active">
            {hasQueryString &&
              <div className="alert alert-info">
                <p>
                  {translate('WARN_Send_Link')}
                </p>
              </div>}

            <UnlockHeader title={'NAV_SendEther'} />

            {unlocked &&
              <article className="row">
                {/* <!-- Sidebar --> */}
                <section className="col-sm-4">
                  <div style={{ maxWidth: 350 }}>
                    <BalanceSidebar />
                    <hr />
                    <Donate onDonate={this.onNewTx} />
                  </div>
                </section>

                <section className="col-sm-8">
                  <div className="row form-group">
                    <h4 className="col-xs-12">
                      {translate('SEND_trans')}
                    </h4>
                  </div>
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
                        onClick={this.generateTx}
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
                          onClick={this.openTxModal}
                        >
                          {translate('SEND_trans')}
                        </button>
                      </div>
                    </div>}
                </section>
              </article>}
          </main>
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

  async getTransactionInfoFromState(): Promise<TransactionWithoutGas> {
    const { wallet } = this.props;
    const { token } = this.state;

    if (this.state.unit === 'ether') {
      return {
        to: this.state.to,
        from: await wallet.getAddress(),
        value: valueToHex(this.state.value),
        data: this.state.data
      };
    } else {
      if (!token) {
        throw new Error('No matching token');
      }

      return {
        to: token.address,
        from: await wallet.getAddress(),
        value: '0x0',
        data: ERC20.transfer(
          this.state.to,
          toTokenUnit(new Big(this.state.value), token)
        )
      };
    }
  }

  async estimateGas() {
    try {
      const transaction = await this.getTransactionInfoFromState();
      // Grab a reference to state. If it has changed by the time the estimateGas
      // call comes back, we don't want to replace the gasLimit in state.
      const state = this.state;
      const gasLimit = await this.props.nodeLib.estimateGas(transaction);
      if (this.state === state) {
        this.setState({ gasLimit: formatGasLimit(gasLimit, state.unit) });
      } else {
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
    if (this.state.unit !== 'ether') {
      return;
    }
    this.setState({
      ...this.state,
      data: value
    });
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
          gasPrice,
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

  generateTx = async () => {
    const { nodeLib, wallet } = this.props;
    const { token } = this.state;
    const stateTxInfo = await this.getTransactionInfoFromState();

    try {
      const transaction = await generateTransaction(
        nodeLib,
        {
          ...stateTxInfo,
          gasLimit: this.state.gasLimit,
          gasPrice: this.props.gasPrice,
          chainId: this.props.network.chainId
        },
        wallet,
        token
      );
      this.setState({ transaction });
    } catch (err) {
      this.props.showNotification('danger', err.message, 5000);
    }
  };

  openTxModal = () => {
    if (this.state.transaction) {
      this.setState({ showTxConfirm: true });
    }
  };

  hideConfirmTx = () => {
    this.setState({ showTxConfirm: false });
  };

  resetTransaction = () => {
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
    gasPrice: toWei(new Big(getGasPriceGwei(state)), 'gwei'),
    transactions: state.wallet.transactions
  };
}

export default connect(mapStateToProps, { showNotification, broadcastTx })(
  SendTransaction
);
