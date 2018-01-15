import { Identicon, UnitDisplay } from 'components/ui';
import { NetworkConfig } from 'config/data';
import { IWallet, Balance, TrezorWallet, LedgerWallet } from 'libs/wallet';
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
  confirmAddr: boolean;
}
export default class AccountInfo extends React.Component<Props, State> {
  public state = {
    showLongBalance: false,
    address: '',
    confirmAddr: false
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

  public toggleConfirmAddr = () => {
    this.setState(state => {
      return { confirmAddr: !state.confirmAddr };
    });
  };

  public toggleShowLongBalance = (e: React.FormEvent<HTMLSpanElement>) => {
    e.preventDefault();
    this.setState(state => {
      return {
        showLongBalance: !state.showLongBalance
      };
    });
  };

  public render() {
    const { network, balance } = this.props;
    const { address, showLongBalance, confirmAddr } = this.state;
    const { blockExplorer, tokenExplorer } = network;
    const wallet = this.props.wallet as LedgerWallet | TrezorWallet;
    return (
      <div className="AccountInfo">
        <h5 className="AccountInfo-section-header">{translate('sidebar_AccountAddr')}</h5>
        <div className="AccountInfo-section AccountInfo-address-section">
          <div className="AccountInfo-address-icon">
            <Identicon address={address} size="100%" />
          </div>
          <div className="AccountInfo-address-wrapper">
            <div className="AccountInfo-address-addr">{address}</div>
          </div>
        </div>

        {typeof wallet.displayAddress === 'function' && (
          <div className="AccountInfo-section">
            <a
              className="AccountInfo-address-hw-addr"
              onClick={() => {
                this.toggleConfirmAddr();
                wallet
                  .displayAddress()
                  .then(() => this.toggleConfirmAddr())
                  .catch(e => {
                    this.toggleConfirmAddr();
                    throw new Error(e);
                  });
              }}
            >
              {confirmAddr ? null : 'Display address on ' + wallet.getWalletType()}
            </a>
            {confirmAddr ? (
              <span className="AccountInfo-address-confirm">
                <Spinner /> Confirm address on {wallet.getWalletType()}
              </span>
            ) : null}
          </div>
        )}

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
                    checkOffline={true}
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
                  <a
                    href={blockExplorer.address(address)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {`${network.name} (${blockExplorer.name})`}
                  </a>
                </li>
              )}
              {!!tokenExplorer && (
                <li className="AccountInfo-list-item">
                  <a
                    href={tokenExplorer.address(address)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
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
