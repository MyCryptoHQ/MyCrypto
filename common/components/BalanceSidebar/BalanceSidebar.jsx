// @flow
import React from 'react';
import Big from 'bignumber.js';
import { BaseWallet } from 'libs/wallet';
import type { NetworkConfig } from 'config/data';
import type { State } from 'reducers';
import { connect } from 'react-redux';
import { getWalletInst, getTokenBalances } from 'selectors/wallet';
import type { TokenBalance } from 'selectors/wallet';
import { getNetworkConfig } from 'selectors/config';
import { Link } from 'react-router';
import TokenBalances from './TokenBalances';
import { formatNumber } from 'utils/formatters';
import { Identicon } from 'components/ui';
import translate from 'translations';
import * as customTokenActions from 'actions/customTokens';

type Props = {
  wallet: BaseWallet,
  balance: Big,
  network: NetworkConfig,
  tokenBalances: TokenBalance[],
  rates: { [string]: number },
  addCustomToken: typeof customTokenActions.addCustomToken,
  removeCustomToken: typeof customTokenActions.removeCustomToken
};

export class BalanceSidebar extends React.Component {
  props: Props;
  state = {
    showLongBalance: false,
    address: ''
  };

  componentDidMount() {
    this.props.wallet
      .getAddress()
      .then(addr => {
        this.setState({ address: addr });
      })
      .catch(err => {
        //TODO: communicate error in UI
        console.log(err);
      });
  }

  render() {
    const { wallet, balance, network, tokenBalances, rates } = this.props;
    const { blockExplorer, tokenExplorer } = network;
    const { address } = this.state;
    if (!wallet) {
      return null;
    }

    return (
      <aside>
        <h5>
          {translate('sidebar_AccountAddr')}
        </h5>
        <ul className="account-info">
          <Identicon address={address} />
          <span className="mono wrap">
            {address}
          </span>
        </ul>
        <hr />
        <h5>
          {translate('sidebar_AccountBal')}
        </h5>
        <ul
          className="account-info point"
          onDoubleClick={this.toggleShowLongBalance}
          title={`${balance.toString()} (Double-Click)`}
        >
          <li>
            <span className="mono wrap">
              {this.state.showLongBalance
                ? balance.toString()
                : formatNumber(balance)}
            </span>
            {` ${network.name}`}
          </li>
        </ul>
        <TokenBalances
          tokens={tokenBalances}
          onAddCustomToken={this.props.addCustomToken}
          onRemoveCustomToken={this.props.removeCustomToken}
        />
        <hr />
        {(!!blockExplorer || !!tokenExplorer) &&
          <div>
            <h5>
              {translate('sidebar_TransHistory')}
            </h5>
            <ul className="account-info">
              {!!blockExplorer &&
                <li>
                  <a
                    href={blockExplorer.address.replace('[[address]]', address)}
                    target="_blank"
                  >
                    {`${network.name} (${blockExplorer.name})`}
                  </a>
                </li>}
              {!!tokenExplorer &&
                <li>
                  <a
                    href={tokenExplorer.address.replace('[[address]]', address)}
                    target="_blank"
                  >
                    {`Tokens (${tokenExplorer.name})`}
                  </a>
                </li>}
            </ul>
          </div>}
        <hr />
        {!!Object.keys(rates).length &&
          <section>
            <h5>
              {translate('sidebar_Equiv')}
            </h5>
            <ul className="account-info">
              {rates['BTC'] &&
                <li>
                  <span className="mono wrap">
                    {formatNumber(balance.times(rates['BTC']))}
                  </span>{' '}
                  BTC
                </li>}
              {rates['REP'] &&
                <li>
                  <span className="mono wrap">
                    {formatNumber(balance.times(rates['REP']))}
                  </span>{' '}
                  REP
                </li>}
              {rates['EUR'] &&
                <li>
                  <span className="mono wrap">
                    €{formatNumber(balance.times(rates['EUR']))}
                  </span>
                  {' EUR'}
                </li>}
              {rates['USD'] &&
                <li>
                  <span className="mono wrap">
                    ${formatNumber(balance.times(rates['USD']))}
                  </span>
                  {' USD'}
                </li>}
              {rates['GBP'] &&
                <li>
                  <span className="mono wrap">
                    £{formatNumber(balance.times(rates['GBP']))}
                  </span>
                  {' GBP'}
                </li>}
              {rates['CHF'] &&
                <li>
                  <span className="mono wrap">
                    {formatNumber(balance.times(rates['CHF']))}
                  </span>{' '}
                  CHF
                </li>}
            </ul>
            <Link to={'swap'} className="btn btn-primary btn-sm">
              Swap via bity
            </Link>
          </section>}
      </aside>
    );
  }

  toggleShowLongBalance = (e: SyntheticMouseEvent) => {
    e.preventDefault();
    this.setState(state => {
      return {
        showLongBalance: !state.showLongBalance
      };
    });
  };
}

function mapStateToProps(state: State) {
  return {
    wallet: getWalletInst(state),
    balance: state.wallet.balance,
    tokenBalances: getTokenBalances(state),
    network: getNetworkConfig(state),
    rates: state.rates
  };
}

export default connect(mapStateToProps, customTokenActions)(BalanceSidebar);
