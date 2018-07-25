import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { SecureWalletName, ledgerReferralURL } from 'config';
import translate, { translateRaw } from 'translations';
import { LedgerWallet } from 'libs/wallet';
import { NetworkConfig } from 'types/network';
import { AppState } from 'features/reducers';
import { getNetworkConfig, getPaths, getSingleDPath } from 'features/config';
import { NewTabLink } from 'components/ui';
import { PrimaryButton, SecondaryButton } from 'components';
import UnsupportedNetwork from './UnsupportedNetwork';
import DeterministicWalletsModal from './DeterministicWalletsModal';
import img from 'assets/images/ledger-nano-illustration.svg';
import './LedgerNano.scss';

interface OwnProps {
  onUnlock(param: any): void;
  clearWalletChoice(): void;
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
        <div className="LedgerDecrypt">
          <div className="alert alert-danger">
            Unlocking a Ledger hardware wallet is only possible on pages served over HTTPS. You can
            unlock your wallet at <NewTabLink href="https://mycrypto.com">MyCrypto.com</NewTabLink>
          </div>
        </div>
      );
    }

    return (
      <div className="LedgerDecrypt">
        <h2 className="LedgerDecrypt-title">
          {translate('UNLOCK_DEVICE', { $device: translateRaw('X_LEDGER') })}
        </h2>
        <p className="LedgerDecrypt-buy">
          Don't have a one?{' '}
          <span>
            <a href={ledgerReferralURL}>Order now!</a>
          </span>
        </p>
        {error && (
          <div className={`LedgerDecrypt-error alert alert-danger ${showErr}`}>{error}</div>
        )}
        <img src={img} alt="Ledger nano illustration" className="LedgerDecrypt-illustration" />
        <div className="LedgerDecrypt-tip-wrapper">
          <p>Tip: </p>
          <p>Make sure you’ve enabled browser support in settings on your device.</p>
        </div>
        <div className="LedgerDecrypt-btn-wrapper">
          <SecondaryButton
            text="Back"
            onClick={this.props.clearWalletChoice}
            className="LedgerDecrypt-btn"
          />
          <div className="flex-spacer" />
          <PrimaryButton
            text="Connect"
            onClick={this.handleNullConnect}
            loading={isLoading}
            loadingTxt={translateRaw('WALLET_UNLOCKING')}
            className="LedgerDecrypt-btn"
          />
        </div>
        <DeterministicWalletsModal
          isOpen={!!publicKey && !!chainCode}
          publicKey={publicKey}
          chainCode={chainCode}
          dPath={dPath}
          dPaths={this.props.dPaths}
          onCancel={this.handleCancel}
          onConfirmAddress={this.handleUnlock}
          onPathChange={this.handlePathChange}
        />
      </div>
    );
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
    dPath: getSingleDPath(state, SecureWalletName.LEDGER_NANO_S),
    dPaths: getPaths(state, SecureWalletName.LEDGER_NANO_S),
    network: getNetworkConfig(state)
  };
}

export const LedgerNanoSDecrypt = connect(mapStateToProps)(LedgerNanoSDecryptClass);
