import React from 'react';
import { connect } from 'react-redux';
import { toChecksumAddress } from 'ethereumjs-util';
<<<<<<< HEAD

import { etherChainExplorerInst } from 'config/data';
import translate from 'translations';
import { IWallet, TrezorWallet, LedgerWallet } from 'libs/wallet';
import { AppState } from 'features/reducers';
import { getOffline, getNetworkConfig } from 'features/config';
import {
  TRefreshAccountBalance,
  refreshAccountBalance,
  getEtherBalance,
  isEtherBalancePending
} from 'features/wallet';
import { UnitDisplay, NewTabLink } from 'components/ui';
=======
import { UnitDisplay, NewTabLink } from 'components/ui';
import { IWallet, TrezorWallet, LedgerWallet, Balance } from 'libs/wallet';
import translate, { translateRaw } from 'translations';
>>>>>>> develop
import Spinner from 'components/ui/Spinner';
import AccountAddress from './AccountAddress';
import './AccountInfo.scss';
import AccountAddress from './AccountAddress';

interface OwnProps {
  wallet: IWallet;
}

interface StateProps {
<<<<<<< HEAD
  etherBalance: ReturnType<typeof getEtherBalance>;
  etherBalancePending: ReturnType<typeof isEtherBalancePending>;
=======
  balance: Balance;
>>>>>>> develop
  network: ReturnType<typeof getNetworkConfig>;
  isOffline: ReturnType<typeof getOffline>;
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
<<<<<<< HEAD
    const { network, etherBalance, isOffline, etherBalancePending } = this.props;
=======
    const { network, isOffline, balance } = this.props;
>>>>>>> develop
    const { address, showLongBalance, confirmAddr } = this.state;

    let blockExplorer;
    let tokenExplorer;
    if (!network.isCustom) {
      // this is kind of ugly but its the result of typeguards, maybe we can find a cleaner solution later on such as just dedicating it to a selector
      blockExplorer = network.blockExplorer;
      tokenExplorer = network.tokenExplorer;
    }

    const wallet = this.props.wallet as LedgerWallet | TrezorWallet;
    return (
      <div>
        <AccountAddress address={toChecksumAddress(address)} />

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
                  value={etherBalance}
                  unit={'ether'}
                  displayShortBalance={!showLongBalance}
                  checkOffline={true}
<<<<<<< HEAD
                  symbol={etherBalance ? network.name : null}
=======
                  symbol={balance.wei ? this.setSymbol(network) : null}
>>>>>>> develop
                />
              </span>
              {etherBalance && (
                <React.Fragment>
                  {etherBalancePending ? (
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

function mapStateToProps(state: AppState): StateProps {
  return {
    etherBalancePending: isEtherBalancePending(state),
    etherBalance: getEtherBalance(state),
    network: getNetworkConfig(state),
    isOffline: getOffline(state)
  };
}
const mapDispatchToProps: DispatchProps = { refreshAccountBalance };
export default connect(mapStateToProps, mapDispatchToProps)(AccountInfo);
