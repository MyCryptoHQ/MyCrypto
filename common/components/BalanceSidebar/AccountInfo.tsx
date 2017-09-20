import { FiatRequestedRatesAction } from 'actions/rates';
import { Identicon } from 'components/ui';
import { NetworkConfig } from 'config/data';
import { Ether } from 'libs/units';
import { IWallet } from 'libs/wallet';
import React from 'react';
import translate from 'translations';
import { formatNumber } from 'utils/formatters';
import './AccountInfo.scss';

interface Props {
  balance: Ether;
  wallet: IWallet;
  network: NetworkConfig;
  fiatRequestedRates(): FiatRequestedRatesAction;
}

interface State {
  showLongBalance: boolean;
  address: string;
}
export default class AccountInfo extends React.Component<Props, State> {
  public state = {
    showLongBalance: false,
    address: ''
  };

  public componentDidMount() {
    this.props.fiatRequestedRates();
    this.props.wallet.getAddress().then(addr => {
      this.setState({ address: addr });
    });
  }

  // TODO: don't use any;
  public toggleShowLongBalance = (e: any) => {
    e.preventDefault();
    this.setState(state => {
      return {
        showLongBalance: !state.showLongBalance
      };
    });
  };

  public render() {
    const { network, balance } = this.props;
    const { blockExplorer, tokenExplorer } = network;
    const { address } = this.state;

    return (
      <div className="AccountInfo">
        <div className="AccountInfo-section">
          <h5 className="AccountInfo-section-header">
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
        </div>

        <div className="AccountInfo-section">
          <h5 className="AccountInfo-section-header">
            {translate('sidebar_AccountBal')}
          </h5>
          <ul className="AccountInfo-list">
            <li className="AccountInfo-list-item">
              <span
                className="AccountInfo-list-item-clickable mono wrap"
                onClick={this.toggleShowLongBalance}
              >
                {this.state.showLongBalance
                  ? balance ? balance.toString() : '???'
                  : balance ? formatNumber(balance.amount) : '???'}
              </span>
              {` ${network.name}`}
            </li>
          </ul>
        </div>

        {(!!blockExplorer || !!tokenExplorer) &&
          <div className="AccountInfo-section">
            <h5 className="AccountInfo-section-header">
              {translate('sidebar_TransHistory')}
            </h5>
            <ul className="AccountInfo-list">
              {!!blockExplorer &&
                <li className="AccountInfo-list-item">
                  <a href={blockExplorer.address(address)} target="_blank">
                    {`${network.name} (${blockExplorer.name})`}
                  </a>
                </li>}
              {!!tokenExplorer &&
                <li className="AccountInfo-list-item">
                  <a href={tokenExplorer.address(address)} target="_blank">
                    {`Tokens (${tokenExplorer.name})`}
                  </a>
                </li>}
            </ul>
          </div>}
      </div>
    );
  }
}
