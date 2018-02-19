import { Identicon, UnitDisplay } from 'components/ui';
import { IWallet, Balance, TrezorWallet, LedgerWallet } from 'libs/wallet';
import React from 'react';
import translate from 'translations';
import './AccountInfo.scss';
import Spinner from 'components/ui/Spinner';
import { getNetworkConfig, getOffline } from 'selectors/config';
import { AppState } from 'reducers';
import { connect } from 'react-redux';
import { NetworkConfig } from 'types/network';
import { TSetAccountBalance, setAccountBalance } from 'actions/wallet';
import { CopyToClipboard } from 'react-copy-to-clipboard';

interface OwnProps {
  wallet: IWallet;
}

interface StateProps {
  balance: Balance;
  network: NetworkConfig;
  isOffline: boolean;
}

interface State {
  showLongBalance: boolean;
  address: string;
  confirmAddr: boolean;
  copied: boolean;
  currentColor: string;
}

interface DispatchProps {
  setAccountBalance: TSetAccountBalance;
}

type Props = OwnProps & StateProps & DispatchProps;

class AccountInfo extends React.Component<Props, State> {
  public state = {
    showLongBalance: false,
    address: '',
    confirmAddr: false,
    copied: false,
    currentColor: 'black'
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

  public onCopy = () => {
    this.setState(state => {
      return {
        copied: true,
        currentColor: 'blue'
      };
    });
  };

  public render() {
    const { network, balance, isOffline } = this.props;
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
      <div className="AccountInfo">
        <h5 className="AccountInfo-section-header">{translate('sidebar_AccountAddr')}</h5>
        <div className="AccountInfo-section AccountInfo-address-section">
          <div className="AccountInfo-address-icon">
            <Identicon address={address} size="100%" />
          </div>
          <div className="AccountInfo-address-wrapper">
            <div className="AccountInfo-address-addr">{address}</div>
            <CopyToClipboard onCopy={this.onCopy} text={address}>
              <div className="copy-clipboard" title="copy to clipboard">
                <svg
                  aria-hidden="true"
                  data-prefix="far"
                  data-icon="copy"
                  role="img"
                  viewBox="0 0 448 512"
                  className="svg-inline--fa fa-copy fa-w-14 fa-2x"
                >
                  <path
                    fill={this.state.currentColor}
                    d="M433.941 65.941l-51.882-51.882A48 48 0 0 0 348.118 0H176c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48v-48h80c26.51 0 48-21.49 48-48V99.882a48 48 0 0 0-14.059-33.941zM266 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h74v224c0 26.51 21.49 48 48 48h96v42a6 6 0 0 1-6 6zm128-96H182a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v202a6 6 0 0 1-6 6zm6-256h-64V48h9.632c1.591 0 3.117.632 4.243 1.757l48.368 48.368a6 6 0 0 1 1.757 4.243V112z"
                  />
                </svg>
                <p>{this.state.copied ? 'copied!' : null}</p>
              </div>
            </CopyToClipboard>
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
                  symbol={balance.wei ? network.name : null}
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
                        onClick={this.props.setAccountBalance}
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
            <h5 className="AccountInfo-section-header">{translate('sidebar_TransHistory')}</h5>
            <ul className="AccountInfo-list">
              {!!blockExplorer && (
                <li className="AccountInfo-list-item">
                  <a
                    href={blockExplorer.addressUrl(address)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {`${network.name} (${blockExplorer.origin})`}
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
function mapStateToProps(state: AppState): StateProps {
  return {
    balance: state.wallet.balance,
    network: getNetworkConfig(state),
    isOffline: getOffline(state)
  };
}
const mapDispatchToProps: DispatchProps = { setAccountBalance };
export default connect(mapStateToProps, mapDispatchToProps)(AccountInfo);
