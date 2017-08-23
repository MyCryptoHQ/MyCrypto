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
import { getTokenBalances } from 'selectors/wallet';
import type { RPCNode } from 'libs/nodes';
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
import { generateTransaction } from 'libs/transaction';

type State = {
  hasQueryString: boolean,
  readOnly: boolean,
  to: string,
  value: string,
  // $FlowFixMe - Comes from getParam not validating unit
  unit: UNIT,
  token: ?Token,
  gasLimit: string,
  data: string,
  gasChanged: boolean,
  transaction: ?BroadcastTransaction,
  showTxConfirm: boolean
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
  showNotification: (
    level: string,
    msg: string,
    duration?: number
  ) => ShowNotificationAction
};

export class SendTransaction extends React.Component {
  props: Props;
  state: State = {
    hasQueryString: false,
    readOnly: false,
    // FIXME use correct defaults
    to: '',
    value: '',
    unit: 'ether',
    token: null,
    gasLimit: '21000',
    data: '',
    gasChanged: false,
    showTxConfirm: false,
    transaction: null
  };

  componentDidMount() {
    const queryPresets = pickBy(this.parseQuery());
    if (Object.keys(queryPresets).length) {
      this.setState({ ...queryPresets, hasQueryString: true });
    }
  }

  componentDidUpdate(_prevProps: Props, prevState: State) {
    // if gas is not changed
    // and we have valid tx
    // and relevant fields changed
    // estimate gas
    // TODO we might want to listen to gas price changes here
    // TODO debunce the call
    if (
      !this.state.gasChanged &&
      this.isValid() &&
      (this.state.to !== prevState.to ||
        this.state.value !== prevState.value ||
        this.state.unit !== prevState.unit ||
        this.state.data !== prevState.data)
    ) {
      this.estimateGas();
    }
  }

  render() {
    const unlocked = !!this.props.wallet;
    const hasEnoughBalance = false;
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
                {'' /* <!-- Sidebar --> */}
                <section className="col-sm-4">
                  <div style={{ maxWidth: 350 }}>
                    <BalanceSidebar />
                    <hr />
                    <Donate onDonate={this.onNewTx} />
                  </div>
                </section>

                <section className="col-sm-8">
                  {readOnly &&
                    !hasEnoughBalance &&
                    <div className="row form-group">
                      <div className="alert alert-danger col-xs-12 clearfix">
                        <strong>
                          Warning! You do not have enough funds to complete this
                          swap.
                        </strong>
                        <br />
                        Please add more funds or access a different wallet.
                      </div>
                    </div>}

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
                      <a
                        className="btn btn-info btn-block"
                        onClick={this.generateTx}
                      >
                        {translate('SEND_generate')}
                      </a>
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
                        <a
                          className="btn btn-primary btn-block col-sm-11"
                          onClick={this.openTxModal}
                        >
                          {translate('SEND_trans')}
                        </a>
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
            signedTransaction={transaction.signedTx}
            onCancel={this.cancelTx}
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
    const readOnly = getParam(query, 'readOnly') == null ? false : true;

    return { to, data, value, unit, gasLimit, readOnly };
  }

  isValid() {
    const { to, value } = this.state;
    return (
      isValidETHAddress(to) &&
      value &&
      Number(value) > 0 &&
      !isNaN(Number(value)) &&
      isFinite(Number(value))
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
    const trans = await this.getTransactionInfoFromState();
    if (!trans) {
      return;
    }

    // Grab a reference to state. If it has changed by the time the estimateGas
    // call comes back, we don't want to replace the gasLimit in state.
    const state = this.state;

    this.props.nodeLib.estimateGas(trans).then(gasLimit => {
      if (this.state === state) {
        this.setState({ gasLimit: formatGasLimit(gasLimit, state.unit) });
      }
    });
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
    // TODO sub gas for eth
    if (value === 'everything') {
      if (unit === 'ether') {
        value = this.props.balance.toString();
      }
      const token = this.props.tokenBalances.find(
        token => token.symbol === unit
      );
      if (!token) {
        return;
      }
      value = token.balance.toString();
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

  cancelTx = () => {
    this.setState({ showTxConfirm: false });
  };

  confirmTx = () => {
    // TODO: Broadcast transaction
    console.log(this.state.transaction);
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
    gasPrice: toWei(new Big(getGasPriceGwei(state)), 'gwei')
  };
}

export default connect(mapStateToProps, { showNotification })(SendTransaction);
