import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { SecureWalletName } from 'config';
import translate, { translateRaw } from 'translations';
import { LedgerWallet } from 'libs/wallet';
import { NetworkConfig } from 'types/network';
import { AppState } from 'features/reducers';
import { configSelectors, configNetworksStaticSelectors } from 'features/config';
import { Spinner, NewTabLink } from 'components/ui';
import UnsupportedNetwork from './UnsupportedNetwork';
import DeterministicWallets from './DeterministicWallets';
import './LedgerNano.scss';
import { Button } from '@mycrypto/ui';
import ledgerIcon from 'common/assets/images/icn-ledger-nano-large.svg';

interface OwnProps {
  onUnlock(param: any): void;
}

interface StateProps {
  dPath: DPath | undefined;
  dPaths: DPath[];
  network: NetworkConfig;
}

interface State {
  publicKey: string;
  chainCode: string;
  dPath: DPath;
  error: string | null;
  isLoading: boolean;
}

type Props = OwnProps & StateProps;

class LedgerNanoSDecryptClass extends PureComponent<Props, State> {
  public state: State = {
    publicKey: '',
    chainCode: '',
    dPath: this.props.dPath || this.props.dPaths[0],
    error: null,
    isLoading: false
  };

  public UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (this.props.dPath !== nextProps.dPath && nextProps.dPath) {
      this.setState({ dPath: nextProps.dPath });
    }
  }

  public render() {
    const { dPath, publicKey, chainCode, error, isLoading } = this.state;
    const showErr = error ? 'is-showing' : '';

    if (!dPath) {
      return <UnsupportedNetwork walletType={translateRaw('x_Ledger')} />;
    }

    if (!process.env.BUILD_ELECTRON && window.location.protocol !== 'https:') {
      return (
        <div className="Panel">
          <div className="alert alert-danger">
            Unlocking a Ledger hardware wallet is only possible on pages served over HTTPS. You can
            unlock your wallet at <NewTabLink href="https://mycrypto.com">MyCrypto.com</NewTabLink>
          </div>
        </div>
      );
    }

    if (publicKey && chainCode) {
      return (
        <DeterministicWallets
          publicKey={publicKey}
          chainCode={chainCode}
          dPath={dPath}
          dPaths={this.props.dPaths}
          onCancel={this.handleCancel}
          onConfirmAddress={this.handleUnlock}
          onPathChange={this.handlePathChange}
        />
      );
    } else {
      return (
        <div className="LedgerPanel-description-content">
          <div className="LedgerPanel-description">
            {translate('LEDGER_TIP')}
            <div className="LedgerPanel-image">
              <img src={ledgerIcon} />
            </div>

            <Button
              className="LedgerPanel-description-button"
              onClick={this.handleNullConnect}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="LedgerDecrypt-message">
                  <Spinner light={true} />
                  {translate('WALLET_UNLOCKING')}
                </div>
              ) : (
                translate('ADD_LEDGER_SCAN')
              )}
            </Button>
          </div>

          <div className={`LedgerDecrypt-error alert alert-danger ${showErr}`}>{error || '-'}</div>
        </div>
      );
    }
  }

  private handlePathChange = (dPath: DPath) => {
    this.handleConnect(dPath);
    this.setState({
      dPath
    });
  };

  private handleConnect = (dPath: DPath) => {
    this.setState({
      isLoading: true,
      error: null
    });

    LedgerWallet.getChainCode(dPath.value)
      .then(res => {
        this.setState({
          publicKey: res.publicKey,
          chainCode: res.chainCode,
          isLoading: false
        });
      })
      .catch(err => {
        this.setState({
          error: translateRaw(err.message),
          isLoading: false
        });
      });
  };

  private handleCancel = () => {
    this.reset();
  };

  private handleUnlock = (address: string, index: number) => {
    this.props.onUnlock(new LedgerWallet(address, this.state.dPath.value, index));
    this.reset();
  };

  private handleNullConnect = (): void => {
    return this.handleConnect(this.state.dPath);
  };

  private reset() {
    this.setState({
      publicKey: '',
      chainCode: '',
      dPath: this.props.dPath || this.props.dPaths[0]
    });
  }
}

function mapStateToProps(state: AppState): StateProps {
  return {
    dPath: configSelectors.getSingleDPath(state, SecureWalletName.LEDGER_NANO_S),
    dPaths: configNetworksStaticSelectors.getPaths(state, SecureWalletName.LEDGER_NANO_S),
    network: configSelectors.getNetworkConfig(state)
  };
}

export const LedgerNanoSDecrypt = connect(mapStateToProps)(LedgerNanoSDecryptClass);
