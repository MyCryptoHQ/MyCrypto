import Big from 'bignumber.js';
// COMPONENTS
import Spinner from 'components/ui/Spinner';
import TabSection from 'containers/TabSection';
import { BalanceSidebar } from 'components';
import { UnlockHeader } from 'components/ui';
import {
  NonceField,
  AddressField,
  AmountField,
  ConfirmationModal,
  CustomMessage,
  DataField,
  GasField
} from './components';
import NavigationPrompt from './components/NavigationPrompt';
// CONFIG
import { donationAddressMap, NetworkConfig } from 'config/data';
// LIBS
import { stripHexPrefix } from 'libs/values';
import { TransactionWithoutGas } from 'libs/messages';
import { RPCNode } from 'libs/nodes';
import {
  BroadcastTransactionStatus,
  CompleteTransaction,
  formatTxInput,
  generateCompleteTransaction,
  getBalanceMinusGasCosts,
  TransactionInput
} from 'libs/transaction';
import { Ether, GWei, UnitKey, Wei } from 'libs/units';
import { isValidETHAddress } from 'libs/validators';
import { IWallet } from 'libs/wallet/IWallet';
import pickBy from 'lodash/pickBy';
import React from 'react';
// REDUX
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import { showNotification, TShowNotification } from 'actions/notifications';
import {
  broadcastTx,
  TBroadcastTx,
  resetWallet,
  TResetWallet
} from 'actions/wallet';
import {
  pollOfflineStatus as dPollOfflineStatus,
  TPollOfflineStatus
} from 'actions/config';
// SELECTORS
import {
  getGasPriceGwei,
  getNetworkConfig,
  getNodeLib
} from 'selectors/config';
import {
  getTokenBalances,
  getTokens,
  getTxFromBroadcastTransactionStatus,
  MergedToken,
  TokenBalance
} from 'selectors/wallet';
import translate from 'translations';
// UTILS
import { formatGasLimit } from 'utils/formatters';
import { getParam } from 'utils/helpers';
import queryString from 'query-string';
// MISC
import customMessages from './messages';

interface State {
  hasQueryString: boolean;
  readOnly: boolean;
  to: string;
  // amount value
  value: string;
  unit: UnitKey;
  token?: MergedToken | null;
  gasLimit: string;
  data: string;
  gasChanged: boolean;
  transaction: CompleteTransaction | null;
  showTxConfirm: boolean;
  generateDisabled: boolean;
  nonce: number | null | undefined;
  hasSetDefaultNonce: boolean;
  generateTxProcessing: boolean;
  walletAddress: string | null;
}

interface Props {
  wallet: IWallet;
  balance: Ether;
  nodeLib: RPCNode;
  network: NetworkConfig;
  tokens: MergedToken[];
  tokenBalances: TokenBalance[];
  gasPrice: Wei;
  transactions: BroadcastTransactionStatus[];
  showNotification: TShowNotification;
  broadcastTx: TBroadcastTx;
  resetWallet: TResetWallet;
  offline: boolean;
  forceOffline: boolean;
  pollOfflineStatus: TPollOfflineStatus;
  location: { search: string };
}

const initialState: State = {
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
  generateDisabled: true,
  nonce: null,
  hasSetDefaultNonce: false,
  generateTxProcessing: false,
  walletAddress: null
};

export class SendTransaction extends React.Component<Props, State> {
  public state: State = initialState;

  public componentDidMount() {
    this.props.pollOfflineStatus();
    const queryPresets = pickBy(this.parseQuery());
    if (Object.keys(queryPresets).length) {
      this.setState(state => {
        return {
          ...state,
          ...queryPresets,
          hasQueryString: true
        };
      });
    }
  }

  public haveFieldsChanged(prevState) {
    return (
      this.state.to !== prevState.to ||
      this.state.value !== prevState.value ||
      this.state.unit !== prevState.unit ||
      this.state.data !== prevState.data
    );
  }

  public shouldReEstimateGas(prevState) {
    // TODO listen to gas price changes here
    // TODO debounce the call
    // handle gas estimation
    return (
      // if any relevant fields changed
      this.haveFieldsChanged(prevState) &&
      // if gas has not changed
      !this.state.gasChanged &&
      // if we have valid tx
      (this.isValid() || (this.props.offline || this.props.forceOffline))
    );
  }

  public handleGasEstimationOnUpdate(prevState) {
    if (this.shouldReEstimateGas(prevState)) {
      this.estimateGas();
    }
  }

  public handleGenerateDisabledOnUpdate() {
    if (this.state.generateDisabled === this.isValid()) {
      this.setState({ generateDisabled: !this.isValid() });
    }
  }

  public handleBroadcastTransactionOnUpdate() {
    // handle clearing the form once broadcast transaction promise resolves and compontent updates
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

  public async handleSetNonceWhenOfflineOnUpdate() {
    const { offline, forceOffline, wallet, nodeLib } = this.props;
    const { hasSetDefaultNonce, nonce } = this.state;
    const unlocked = !!wallet;
    if (unlocked) {
      const from = await wallet.getAddressString();
      if (forceOffline && !offline && !hasSetDefaultNonce) {
        const nonceHex = await nodeLib.getTransactionCount(from);
        const newNonce = parseInt(stripHexPrefix(nonceHex), 10);
        this.setState({ nonce: newNonce, hasSetDefaultNonce: true });
      }
      if (!forceOffline && !offline && nonce) {
        // set hasSetDefaultNonce back to false in case user toggles force offline several times
        this.setState({ nonce: null, hasSetDefaultNonce: false });
      }
    }
  }

  public handleWalletStateOnUpdate(prevProps) {
    if (this.props.wallet !== prevProps.wallet && !!prevProps.wallet) {
      this.setState(initialState);
    }
  }

  public async setWalletAddressOnUpdate() {
    if (this.props.wallet) {
      const walletAddress = await this.props.wallet.getAddressString();
      if (walletAddress !== this.state.walletAddress) {
        this.setState({ walletAddress });
      }
    }
  }

  public componentDidUpdate(prevProps: Props, prevState: State) {
    this.handleGasEstimationOnUpdate(prevState);
    this.handleGenerateDisabledOnUpdate();
    this.handleBroadcastTransactionOnUpdate();
    this.handleSetNonceWhenOfflineOnUpdate();
    this.handleWalletStateOnUpdate(prevProps);
    this.setWalletAddressOnUpdate();
  }

  public onNonceChange = (value: number) => {
    this.setState({ nonce: value });
  };

  public render() {
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
      transaction,
      nonce,
      generateTxProcessing
    } = this.state;
    const { offline, forceOffline, balance } = this.props;
    const customMessage = customMessages.find(m => m.to === to);
    return (
      <TabSection>
        <section className="Tab-content">
          <UnlockHeader
            title={
              <div>
                {translate('NAV_SendEther')}
                {offline || forceOffline ? (
                  <span style={{ color: 'red' }}> (Offline)</span>
                ) : null}
              </div>
            }
          />
          <NavigationPrompt
            when={unlocked}
            onConfirm={this.props.resetWallet}
          />
          <div className="row">
            {/* Send Form */}
            {unlocked && (
              <main className="col-sm-8">
                <div className="Tab-content-pane">
                  {hasQueryString && (
                    <div className="alert alert-info">
                      <p>{translate('WARN_Send_Link')}</p>
                    </div>
                  )}

                  <AddressField
                    placeholder={donationAddressMap.ETH}
                    value={this.state.to}
                    onChange={readOnly ? null : this.onAddressChange}
                  />
                  <AmountField
                    value={value}
                    unit={unit}
                    balance={balance}
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
                  {(offline || forceOffline) && (
                      <div>
                        <NonceField
                          value={nonce}
                          onChange={this.onNonceChange}
                          placeholder={'0'}
                        />
                      </div>
                    )}
                  {unit === 'ether' && (
                    <DataField
                      value={data}
                      onChange={readOnly ? void 0 : this.onDataChange}
                    />
                  )}
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

                  {generateTxProcessing && (
                    <div className="container">
                      <div className="row form-group text-center">
                        <Spinner size="5x" />
                      </div>
                    </div>
                  )}

                  {transaction && (
                    <div>
                      <div className="row form-group">
                        <div className="col-sm-6">
                          <label>{translate('SEND_raw')}</label>
                          <textarea
                            className="form-control"
                            value={transaction.rawTx}
                            rows={4}
                            readOnly={true}
                          />
                        </div>
                        <div className="col-sm-6">
                          <label>{translate('SEND_signed')}</label>
                          <textarea
                            className="form-control"
                            value={transaction.signedTx}
                            rows={4}
                            readOnly={true}
                          />
                          {offline && (
                            <p>
                              To broadcast this transaction, paste the above
                              into{' '}
                              <a href="https://myetherwallet.com/pushTx">
                                {' '}
                                myetherwallet.com/pushTx
                              </a>{' '}
                              or{' '}
                              <a href="https://etherscan.io/pushTx">
                                {' '}
                                etherscan.io/pushTx
                              </a>
                            </p>
                          )}
                        </div>
                      </div>

                      {!offline && (
                        <div className="row form-group">
                          <div className="col-xs-12">
                            <button
                              className="btn btn-primary btn-block"
                              disabled={!this.state.transaction}
                              onClick={this.openTxModal}
                            >
                              {translate('SEND_trans')}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </main>
            )}

            {/* Sidebar */}
            {unlocked && (
              <section className="col-sm-4">
                <BalanceSidebar />
              </section>
            )}
          </div>
          {transaction &&
            showTxConfirm && (
              <ConfirmationModal
                fromAddress={this.state.walletAddress}
                signedTx={transaction.signedTx}
                onClose={this.hideConfirmTx}
                onConfirm={this.confirmTx}
              />
            )}
        </section>
      </TabSection>
    );
  }

  public parseQuery() {
    const searchStr = this.props.location.search;
    const query = queryString.parse(searchStr);
    const to = getParam(query, 'to');
    const data = getParam(query, 'data');
    const unit = getParam(query, 'tokenSymbol');
    const token = this.props.tokens.find(x => x.symbol === unit);
    const value = getParam(query, 'value');
    let gasLimit = getParam(query, 'gaslimit');
    if (gasLimit === null) {
      gasLimit = getParam(query, 'limit');
    }
    const readOnly = getParam(query, 'readOnly') != null;
    return { to, token, data, value, unit, gasLimit, readOnly };
  }

  public isValidNonce() {
    const { offline, forceOffline } = this.props;
    const { nonce } = this.state;
    let valid = true;
    if (offline || forceOffline) {
      if (!nonce || nonce < 0) {
        valid = false;
      }
    }
    return valid;
  }

  public isValid() {
    const { to, value, gasLimit } = this.state;
    return (
      isValidETHAddress(to) &&
      value &&
      Number(value) > 0 &&
      !isNaN(Number(value)) &&
      isFinite(Number(value)) &&
      !isNaN(parseInt(gasLimit, 10)) &&
      isFinite(parseInt(gasLimit, 10)) &&
      this.isValidNonce()
    );
  }

  public async getFormattedTxFromState(): Promise<TransactionWithoutGas> {
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

  public isValidValue() {
    return !isNaN(parseInt(this.state.value, 10));
  }

  public async estimateGas() {
    const { offline, forceOffline, nodeLib } = this.props;
    let gasLimit;

    if (offline || forceOffline) {
      const { unit } = this.state;
      if (unit === 'ether') {
        gasLimit = 21000;
      } else {
        gasLimit = 150000;
      }
      this.setState({ gasLimit });
      return;
    }

    if (!this.isValidValue()) {
      return;
    }

    if (this.props.wallet) {
      try {
        const cachedFormattedTx = await this.getFormattedTxFromState();
        // Grab a reference to state. If it has changed by the time the estimateGas
        // call comes back, we don't want to replace the gasLimit in state.
        const state = this.state;
        gasLimit = await nodeLib.estimateGas(cachedFormattedTx);
        if (this.state === state) {
          this.setState({ gasLimit: formatGasLimit(gasLimit, state.unit) });
        } else {
          // state has changed, so try again from the start (with the hope that state won't change by the next time)
          this.estimateGas();
        }
      } catch (error) {
        this.setState({ generateDisabled: true });
        this.props.showNotification('danger', error.message, 5000);
      }
    }
  }

  public onAddressChange = (value: string) => {
    this.setState({
      to: value
    });
  };

  public onDataChange = (value: string) => {
    if (this.state.unit === 'ether') {
      this.setState({ data: value });
    }
  };

  public onGasChange = (value: string) => {
    this.setState({ gasLimit: value, gasChanged: true });
  };

  public handleEverythingAmountChange = (
    value: string,
    unit: string
  ): string => {
    if (unit === 'ether') {
      const { balance, gasPrice } = this.props;
      const { gasLimit } = this.state;
      const weiBalance = balance.toWei();
      const bigGasLimit = new Big(gasLimit);
      value = getBalanceMinusGasCosts(
        bigGasLimit,
        gasPrice,
        weiBalance
      ).toString();
    } else {
      const tokenBalance = this.props.tokenBalances.find(
        tBalance => tBalance.symbol === unit
      );
      if (!tokenBalance) {
        throw new Error(`${unit}: not found in token balances;`);
      }
      value = tokenBalance.balance.toString();
    }
    return value;
  };

  public onAmountChange = (value: string, unit: UnitKey) => {
    if (value === 'everything') {
      value = this.handleEverythingAmountChange(value, unit);
    }
    let transaction = this.state.transaction;
    let generateDisabled = this.state.generateDisabled;
    if (unit && unit !== this.state.unit) {
      value = '';
      transaction = null;
      generateDisabled = true;
    }
    const token = this.props.tokens.find(x => x.symbol === unit);
    this.setState({
      value,
      unit,
      token,
      transaction,
      generateDisabled
    });
  };

  public resetJustTx = async (): Promise<any> =>
    new Promise(resolve =>
      this.setState(
        {
          transaction: null
        },
        resolve
      )
    );

  public generateTxFromState = async () => {
    this.setState({ generateTxProcessing: true });
    await this.resetJustTx();
    const { nodeLib, wallet, gasPrice, network, offline } = this.props;
    const { token, unit, value, to, data, gasLimit, nonce } = this.state;
    const chainId = network.chainId;
    const transactionInput = {
      token,
      unit,
      value,
      to,
      data
    };
    const bigGasLimit = new Big(gasLimit);
    try {
      const signedTx = await generateCompleteTransaction(
        wallet,
        nodeLib,
        gasPrice,
        bigGasLimit,
        chainId,
        transactionInput,
        false,
        nonce,
        offline
      );
      this.setState({ transaction: signedTx, generateTxProcessing: false });
    } catch (err) {
      this.setState({ generateTxProcessing: false });
      this.props.showNotification('danger', err.message, 5000);
    }
  };

  public openTxModal = () => {
    this.setState({ showTxConfirm: true });
  };

  public hideConfirmTx = () => {
    this.setState({ showTxConfirm: false });
  };

  public resetTx = () => {
    this.setState({
      to: '',
      value: '',
      transaction: null
    });
  };

  public confirmTx = (signedTx: string) => {
    this.props.broadcastTx(signedTx);
  };
}

function mapStateToProps(state: AppState) {
  return {
    wallet: state.wallet.inst,
    balance: state.wallet.balance,
    tokenBalances: getTokenBalances(state),
    nodeLib: getNodeLib(state),
    network: getNetworkConfig(state),
    tokens: getTokens(state),
    gasPrice: new GWei(getGasPriceGwei(state)).toWei(),
    transactions: state.wallet.transactions,
    offline: state.config.offline,
    forceOffline: state.config.forceOffline
  };
}

export default connect(mapStateToProps, {
  showNotification,
  broadcastTx,
  resetWallet,
  pollOfflineStatus: dPollOfflineStatus
})(SendTransaction);
