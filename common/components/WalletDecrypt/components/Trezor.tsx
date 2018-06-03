import { TrezorWallet, TREZOR_MINIMUM_FIRMWARE } from 'libs/wallet';
import React, { PureComponent } from 'react';
import translate, { translateRaw } from 'translations';
import TrezorConnect from 'vendor/trezor-connect';
import DeterministicWalletsModal from './DeterministicWalletsModal';
import UnsupportedNetwork from './UnsupportedNetwork';
import { Spinner, NewTabLink } from 'components/ui';
import { AppState } from 'reducers';
import { connect } from 'react-redux';
import { SecureWalletName, trezorReferralURL } from 'config';
import { getSingleDPath, getPaths } from 'selectors/config/wallet';
import { NetworkConfig } from 'types/network';
import './Trezor.scss';
import { getNetworkConfig } from 'selectors/config';

//todo: conflicts with comment in walletDecrypt -> onUnlock method
interface OwnProps {
  onUnlock(param: any): void;
}

interface StateProps {
  dPath: DPath | undefined;
  dPaths: DPath[];
  network: NetworkConfig;
}

// todo: nearly duplicates ledger component props
interface State {
  publicKey: string;
  chainCode: string;
  dPath: DPath;
  error: string | null;
  isLoading: boolean;
}

type Props = OwnProps & StateProps;

class TrezorDecryptClass extends PureComponent<Props, State> {
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
      return <UnsupportedNetwork walletType={translateRaw('x_Trezor')} />;
    }

    return (
      <div className="TrezorDecrypt">
        <button
          className="TrezorDecrypt-decrypt btn btn-primary btn-lg btn-block"
          onClick={this.handleNullConnect}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="TrezorDecrypt-message">
              <Spinner light={true} />
              Unlocking...
            </div>
          ) : (
            translate('ADD_TREZOR_SCAN')
          )}
        </button>

        <NewTabLink className="TrezorDecrypt-buy btn btn-sm btn-default" href={trezorReferralURL}>
          {translate('Don’t have a TREZOR? Order one now!')}
        </NewTabLink>

        <div className={`TrezorDecrypt-error alert alert-danger ${showErr}`}>{error || '-'}</div>

        <div className="TrezorDecrypt-help">
          <NewTabLink href="https://support.mycrypto.com/accessing-your-wallet/how-to-use-your-trezor-with-mycrypto.html">
            How to use TREZOR with MyCrypto
          </NewTabLink>
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
    this.setState({ dPath });
    this.handleConnect(dPath);
  };

  private handleConnect = (dPath: DPath): void => {
    this.setState({
      isLoading: true,
      error: null
    });

    (TrezorConnect as any).getXPubKey(
      dPath.value,
      (res: any) => {
        if (res.success) {
          this.setState({
            dPath,
            publicKey: res.publicKey,
            chainCode: res.chainCode,
            isLoading: false
          });
        } else {
          this.setState({
            error: res.error,
            isLoading: false
          });
        }
      },
      TREZOR_MINIMUM_FIRMWARE
    );
  };

  private handleCancel = () => {
    this.reset();
  };

  private handleUnlock = (address: string, index: number) => {
    this.props.onUnlock(new TrezorWallet(address, this.state.dPath.value, index));
    this.reset();
  };

  private handleNullConnect = (): void => {
    this.handleConnect(this.state.dPath);
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
    dPath: getSingleDPath(state, SecureWalletName.TREZOR),
    dPaths: getPaths(state, SecureWalletName.TREZOR),
    network: getNetworkConfig(state)
  };
}

export const TrezorDecrypt = connect(mapStateToProps)(TrezorDecryptClass);
