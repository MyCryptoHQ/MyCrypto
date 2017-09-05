// @flow
import './AccountInfo.scss';
import React from 'react';
import translate from 'translations';
import { Identicon } from 'components/ui';
import { formatNumber } from 'utils/formatters';
import type Big from 'bignumber.js';
import type { BaseWallet } from 'libs/wallet';
import type { NetworkConfig } from 'config/data';

type Props = {
  balance: Big,
  wallet: BaseWallet,
  network: NetworkConfig
};

export default class AccountInfo extends React.Component {
  props: Props;

  state = {
    showLongBalance: false,
    address: ''
  };

  componentDidMount() {
    this.props.wallet.getAddress().then(addr => {
      this.setState({ address: addr });
    });
  }

  toggleShowLongBalance = (e: SyntheticMouseEvent) => {
    e.preventDefault();
    this.setState(state => {
      return {
        showLongBalance: !state.showLongBalance
      };
    });
  };

  render() {
    const { network, balance } = this.props;
    const { blockExplorer, tokenExplorer } = network;
    const { address } = this.state;

    return (
      <div className="AccountInfo">
        <h5 className="AccountInfo-header">
          {translate('sidebar_AccountAddr')}
        </h5>
        <div className="AccountInfo-address">
          <div className="AccountInfo-address-icon">
            <Identicon address={address} size="100%" />
          </div>
          <div className="AccountInfo-address-addr">
            {address}
          </div>
        </div>

        <h5 className="AccountInfo-header">
          {translate('sidebar_AccountBal')}
        </h5>
        <ul className="AccountInfo-list">
          <li className="AccountInfo-list-item">
            <span
              className="AccountInfo-list-item-clickable mono wrap"
              onClick={this.toggleShowLongBalance}
              title={`${balance.toString()}`}
            >
              {this.state.showLongBalance
                ? balance.toString()
                : formatNumber(balance)}
            </span>
            {` ${network.name}`}
          </li>
        </ul>

        {(!!blockExplorer || !!tokenExplorer) &&
          <div>
            <h5 className="AccountInfo-header">
              {translate('sidebar_TransHistory')}
            </h5>
            <ul className="AccountInfo-list">
              {!!blockExplorer &&
                <li className="AccountInfo-list-item">
                  <a
                    href={blockExplorer.address.replace('[[address]]', address)}
                    target="_blank"
                  >
                    {`${network.name} (${blockExplorer.name})`}
                  </a>
                </li>}
              {!!tokenExplorer &&
                <li className="AccountInfo-list-item">
                  <a
                    href={tokenExplorer.address.replace('[[address]]', address)}
                    target="_blank"
                  >
                    {`Tokens (${tokenExplorer.name})`}
                  </a>
                </li>}
            </ul>
          </div>}
      </div>
    );
  }
}
