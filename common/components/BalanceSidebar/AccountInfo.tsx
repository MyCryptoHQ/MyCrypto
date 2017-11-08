import { TFetchCCRates } from 'actions/rates';
import { Identicon, UnitDisplay } from 'components/ui';
import { NetworkConfig } from 'config/data';
import { IWallet } from 'libs/wallet';
import { Wei } from 'libs/units';
import React from 'react';
import translate from 'translations';
import './AccountInfo.scss';

interface Props {
  balance: Wei;
  wallet: IWallet;
  network: NetworkConfig;
  fetchCCRates: TFetchCCRates;
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

  public async setAddressFromWallet() {
    const address = await this.props.wallet.getAddress();
    if (address !== this.state.address) {
      this.setState({ address });
    }
  }

  public componentDidMount() {
    this.props.fetchCCRates();
    this.setAddressFromWallet();
  }

  public componentDidUpdate() {
    this.setAddressFromWallet();
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
    const { address, showLongBalance } = this.state;

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
            <div className="AccountInfo-address-addr">{address}</div>
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
                <UnitDisplay
                  value={balance}
                  unit={'ether'}
                  displayShortBalance={!showLongBalance}
                />
              </span>
              {network.name}
            </li>
          </ul>
        </div>

        {(!!blockExplorer || !!tokenExplorer) && (
            <div className="AccountInfo-section">
              <h5 className="AccountInfo-section-header">
                {translate('sidebar_TransHistory')}
              </h5>
              <ul className="AccountInfo-list">
                {!!blockExplorer && (
                  <li className="AccountInfo-list-item">
                    <a href={blockExplorer.address(address)} target="_blank">
                      {`${network.name} (${blockExplorer.name})`}
                    </a>
                  </li>
                )}
                {!!tokenExplorer && (
                  <li className="AccountInfo-list-item">
                    <a href={tokenExplorer.address(address)} target="_blank">
                      {`Tokens (${tokenExplorer.name})`}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}
      </div>
    );
  }
}
