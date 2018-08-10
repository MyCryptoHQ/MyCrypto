import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { SecureWalletName, trezorReferralURL } from 'config';
import translate, { translateRaw } from 'translations';
import { TrezorWallet } from 'libs/wallet';
import { AppState } from 'features/reducers';
import { getSingleDPath, getPaths } from 'features/config';
import { Spinner, NewTabLink } from 'components/ui';
import UnsupportedNetwork from './UnsupportedNetwork';
import DeterministicWalletsModal from './DeterministicWalletsModal';
import './Trezor.scss';

//todo: conflicts with comment in walletDecrypt -> onUnlock method
interface OwnProps {
  onUnlock(param: any): void;
}

interface StateProps {
  dPath: DPath | undefined;
  dPaths: DPath[];
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
              {translate('WALLET_UNLOCKING')}
            </div>
          ) : (
            translate('ADD_TREZOR_SCAN')
          )}
        </button>

        <NewTabLink className="TrezorDecrypt-buy btn btn-sm btn-default" href={trezorReferralURL}>
          {translate('ORDER_TREZOR')}
        </NewTabLink>

        <div className={`TrezorDecrypt-error alert alert-danger ${showErr}`}>{error || '-'}</div>

        <div className="TrezorDecrypt-help">
          <NewTabLink href="https://support.mycrypto.com/accessing-your-wallet/how-to-use-your-trezor-with-mycrypto.html">
            {translate('HOWTO_TREZOR')}
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

    TrezorWallet.getChainCode(dPath.value)
      .then(res => {
        this.setState({
          dPath,
          publicKey: res.publicKey,
          chainCode: res.chainCode,
          isLoading: false
        });
      })
      .catch(err => {
        this.setState({
          error: err.message,
          isLoading: false
        });
      });
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
    dPaths: getPaths(state, SecureWalletName.TREZOR)
  };
}

export const TrezorDecrypt = connect(mapStateToProps)(TrezorDecryptClass);
