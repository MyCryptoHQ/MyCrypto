// @flow
import React from 'react';
import Big from 'big.js';
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
  addCustomToken: typeof customTokenActions.addCustomToken,
  removeCustomToken: typeof customTokenActions.removeCustomToken
};

export class BalanceSidebar extends React.Component {
  props: Props;
  state = {
    showLongBalance: false
  };

  render() {
    const { wallet, balance, network, tokenBalances } = this.props;
    const { blockExplorer, tokenExplorer } = network;
    if (!wallet) {
      return null;
    }
    const ajaxReq = {};

    return (
      <aside>
        <h5>
          {translate('sidebar_AccountAddr')}
        </h5>
        <ul className="account-info">
          <Identicon address={wallet.getAddress()} />
          <span className="mono wrap">
            {wallet.getAddress()}
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
              {this.state.showLongBalance ? balance.toString() : formatNumber(balance)}
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
                    href={blockExplorer.address.replace('[[address]]', wallet.getAddress())}
                    target="_blank"
                  >
                    {`${network.name} (${blockExplorer.name})`}
                  </a>
                </li>}
              {!!tokenExplorer &&
                <li>
                  <a
                    href={tokenExplorer.address.replace('[[address]]', wallet.getAddress())}
                    target="_blank"
                  >
                    {`Tokens (${tokenExplorer.name})`}
                  </a>
                </li>}
            </ul>
          </div>}
        <hr />
        {false &&
          ajaxReq.type == 'ETH' &&
          <section>
            <h5>
              {translate('sidebar_Equiv')}
            </h5>
            {/* <ul className="account-info">
              <li>
                <span className="mono wrap">{filters.number(wallet.btcBalance)}</span> BTC
              </li>
              <li>
                <span className="mono wrap">{filters.number(wallet.repBalance)}</span> REP
              </li>
              <li>
                <span className="mono wrap">{filters.currency(wallet.eurBalance, '€')}</span> EUR
              </li>
              <li>
                <span className="mono wrap">{filters.currency(wallet.usdBalance, '$')}</span> USD
              </li>
              <li>
                <span className="mono wrap">{filters.currency(wallet.chfBalance, ' ')}</span> CHF
              </li>
            </ul> */}
            <Link to={'swap'} className="btn btn-primary btn-sm" target="_blank">
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

function mapStateToProps(state: State, props: Props) {
  return {
    wallet: getWalletInst(state),
    balance: state.wallet.balance,
    tokenBalances: getTokenBalances(state),
    network: getNetworkConfig(state)
  };
}

export default connect(mapStateToProps, customTokenActions)(BalanceSidebar);
