import React from 'react';
import { connect } from 'react-redux';
import { UnitDisplay, NewTabLink } from 'components/ui';
import { IWallet, HardwareWallet, Balance } from 'libs/wallet';
import translate, { translateRaw } from 'translations';
import Spinner from 'components/ui/Spinner';
import { getNetworkConfig, getOffline, getChecksumAddressFn } from 'selectors/config';
import { AppState } from 'reducers';
import { NetworkConfig } from 'types/network';
import { TRefreshAccountBalance, refreshAccountBalance } from 'actions/wallet';
import { etherChainExplorerInst } from 'config/data';
import './AccountInfo.scss';
import AccountAddress from './AccountAddress';

interface OwnProps {
  wallet: IWallet;
}

interface StateProps {
  balance: Balance;
  network: ReturnType<typeof getNetworkConfig>;
  isOffline: ReturnType<typeof getOffline>;
  toChecksumAddress: ReturnType<typeof getChecksumAddressFn>;
}

interface State {
  showLongBalance: boolean;
  address: string;
  confirmAddr: boolean;
}

interface DispatchProps {
  refreshAccountBalance: TRefreshAccountBalance;
}

type Props = OwnProps & StateProps & DispatchProps;

class AccountInfo extends React.Component<Props, State> {
  public state = {
    showLongBalance: false,
    address: '',
    confirmAddr: false
  };

  public setAddressFromWallet() {
    const address = this.props.wallet.getAddressString();
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
    const { network, isOffline, balance, toChecksumAddress, wallet } = this.props;
    const { address, showLongBalance, confirmAddr } = this.state;

    let blockExplorer;
    let tokenExplorer;
    if (!network.isCustom) {
      // this is kind of ugly but its the result of typeguards, maybe we can find a cleaner solution later on such as just dedicating it to a selector
      blockExplorer = network.blockExplorer;
      tokenExplorer = network.tokenExplorer;
    }

    return (
      <div>
        <AccountAddress address={toChecksumAddress(address)} />

        {isHardwareWallet(wallet) && (
          <div className="AccountInfo-section">
            <a
              className="AccountInfo-address-hw-addr"
              onClick={() => {
                this.toggleConfirmAddr();
                wallet
                  .displayAddress()
                  .then(() => this.toggleConfirmAddr())
                  .catch((e: Error | string) => {
                    console.error('Display address failed', e);
                    this.toggleConfirmAddr();
                  });
              }}
            >
              {confirmAddr
                ? null
                : translate('SIDEBAR_DISPLAY_ADDR', { $wallet: wallet.getWalletType() })}
            </a>
            {confirmAddr ? (
              <span className="AccountInfo-address-confirm">
                <Spinner /> Confirm address on {wallet.getWalletType()}
              </span>
            ) : null}
          </div>
        )}

        <div className="AccountInfo-section">
          <h5 className="AccountInfo-section-header">{translate('SIDEBAR_ACCOUNTBAL')}</h5>
          <ul className="AccountInfo-list">
            <li className="AccountInfo-list-item AccountInfo-balance">
              <span
                className="AccountInfo-list-item-clickable AccountInfo-balance-amount mono wrap"
                onClick={this.toggleShowLongBalance}
              >
                <UnitDisplay
                  value={balance.wei}
                  unit={'ether'}
                  displayShortBalance={!showLongBalance}
                  checkOffline={true}
                  symbol={balance.wei ? this.setSymbol(network) : null}
                />
              </span>
              {balance.wei && (
                <React.Fragment>
                  {balance.isPending ? (
                    <Spinner />
                  ) : (
                    !isOffline && (
                      <button
                        className="AccountInfo-section-refresh"
                        onClick={this.props.refreshAccountBalance}
                      >
                        <i className="fa fa-refresh" />
                      </button>
                    )
                  )}
                </React.Fragment>
              )}
            </li>
          </ul>
        </div>

        {(!!blockExplorer || !!tokenExplorer) && (
          <div className="AccountInfo-section">
            <h5 className="AccountInfo-section-header">{translate('SIDEBAR_TRANSHISTORY')}</h5>
            <ul className="AccountInfo-list">
              {!!blockExplorer && (
                <li className="AccountInfo-list-item">
                  <NewTabLink href={blockExplorer.addressUrl(address)}>
                    {`${network.name} (${blockExplorer.origin})`}
                  </NewTabLink>
                </li>
              )}
              {network.id === 'ETH' && (
                <li className="AccountInfo-list-item">
                  <NewTabLink href={etherChainExplorerInst.addressUrl(address)}>
                    {`${network.name} (${etherChainExplorerInst.origin})`}
                  </NewTabLink>
                </li>
              )}
              {!!tokenExplorer && (
                <li className="AccountInfo-list-item">
                  <NewTabLink href={tokenExplorer.address(address)}>
                    {`Tokens (${tokenExplorer.name})`}
                  </NewTabLink>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    );
  }

  private setSymbol(network: NetworkConfig) {
    if (network.isTestnet) {
      return `${network.unit} (${translateRaw('TESTNET')})`;
    }
    return network.unit;
  }
}

function isHardwareWallet(wallet: IWallet): wallet is HardwareWallet {
  return typeof (wallet as any).displayAddress === 'function';
}

function mapStateToProps(state: AppState): StateProps {
  return {
    balance: state.wallet.balance,
    network: getNetworkConfig(state),
    isOffline: getOffline(state),
    toChecksumAddress: getChecksumAddressFn(state)
  };
}
const mapDispatchToProps: DispatchProps = { refreshAccountBalance };
export default connect(mapStateToProps, mapDispatchToProps)(AccountInfo);
