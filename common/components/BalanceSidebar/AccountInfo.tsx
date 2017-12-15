import { Identicon, UnitDisplay } from 'components/ui';
import { NetworkConfig } from 'config/data';
import { IWallet, Balance } from 'libs/wallet';
import React from 'react';
import translate from 'translations';
import './AccountInfo.scss';
import Spinner from 'components/ui/Spinner';

interface Props {
  balance: Balance;
  wallet: IWallet;
  network: NetworkConfig;
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
    const address = await this.props.wallet.getAddressString();
    if (address !== this.state.address) {
      this.setState({ address });
    }
  }

  public componentDidMount() {
    this.setAddressFromWallet();
  }

  public componentDidUpdate() {
    this.setAddressFromWallet();
  }

  // TODO: don't use any;
  public toggleShowLongBalance = (e: React.SyntheticEvent<HTMLSpanElement>) => {
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
          <h5 className="AccountInfo-section-header">{translate('sidebar_AccountAddr')}</h5>
          <div className="AccountInfo-address">
            <div className="AccountInfo-address-icon">
              <Identicon address={address} size="100%" />
            </div>
            <div className="AccountInfo-address-addr">{address}</div>
          </div>
        </div>

        <div className="AccountInfo-section">
          <h5 className="AccountInfo-section-header">{translate('sidebar_AccountBal')}</h5>
          <ul className="AccountInfo-list">
            <li className="AccountInfo-list-item">
              <span
                className="AccountInfo-list-item-clickable mono wrap"
                onClick={this.toggleShowLongBalance}
              >
                {balance.isPending ? (
                  <Spinner />
                ) : (
                  <UnitDisplay
                    value={balance.wei}
                    unit={'ether'}
                    displayShortBalance={!showLongBalance}
                  />
                )}
              </span>
              {!balance.isPending ? balance.wei ? <span> {network.name}</span> : null : null}
            </li>
          </ul>
        </div>

        {(!!blockExplorer || !!tokenExplorer) && (
          <div className="AccountInfo-section">
            <h5 className="AccountInfo-section-header">{translate('sidebar_TransHistory')}</h5>
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
