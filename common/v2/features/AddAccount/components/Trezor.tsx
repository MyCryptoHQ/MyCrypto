import ConnectTrezor from 'common/assets/images/icn-connect-trezor-new.svg';
import { Spinner } from 'components/ui';

import { FormData } from 'v2/features/AddAccount/types';
import { getNetworkByName } from 'v2/services/Store';
import { SecureWalletName } from 'v2/types';
import { configNetworksStaticSelectors } from 'features/config';
import { AppState } from 'features/reducers';
import { TrezorWallet } from 'libs/wallet';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import translate, { translateRaw } from 'translations';
import DeterministicWallets from './DeterministicWallets';
import './Trezor.scss';
import UnsupportedNetwork from './UnsupportedNetwork';
import { Button } from '@mycrypto/ui';

//todo: conflicts with comment in walletDecrypt -> onUnlock method
interface OwnProps {
  formData: FormData;
  onUnlock(param: any): void;
}

interface StateProps {
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
    dPath: this.getInitialDPath(),
    error: null,
    isLoading: false
  };

  public render() {
    const { dPath, publicKey, chainCode, isLoading } = this.state;
    const network = getNetworkByName(this.props.formData.network);

    if (!dPath) {
      return <UnsupportedNetwork walletType={translateRaw('x_Trezor')} />;
    }

    if (publicKey && chainCode) {
      return (
        <div className="Mnemonic-dpath">
          <DeterministicWallets
            network={network}
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
    } else {
      return (
        <div className="Panel">
          <div className="Panel-title">
            {translate('UNLOCK_WALLET')} {`Your ${translateRaw('X_TREZOR')}`}
          </div>
          <div className="TrezorDecrypt">
            <div className="TrezorDecrypt-description">
              {translate('TREZOR_TIP')}
              <div className="TrezorDecrypt-img">
                <img src={ConnectTrezor} />
              </div>
            </div>
            {/* <div className={`TrezorDecrypt-error alert alert-danger ${showErr}`}>
              {error || '-'}
            </div> */}

            {isLoading ? (
              <div className="TrezorDecrypt-loading">
                <Spinner /> {translate('WALLET_UNLOCKING')}
              </div>
            ) : (
              <Button
                className="TrezorDecrypt-button"
                onClick={this.handleNullConnect}
                disabled={isLoading}
              >
                {translate('ADD_TREZOR_SCAN')}
              </Button>
            )}
            <div className="TrezorDecrypt-footer">
              {translate('ORDER_TREZOR')} <br />
              {translate('HOWTO_TREZOR')}
            </div>
          </div>
        </div>
      );
    }
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

  private getInitialDPath() : DPath {
    const network = getNetworkByName(this.props.formData.network);
    return network && network.dPaths.trezor ? network.dPaths.trezor : this.props.dPaths[0]
  }

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
      dPath: this.getInitialDPath()
    });
  }
}

function mapStateToProps(state: AppState): StateProps {
  return {
    dPaths: configNetworksStaticSelectors.getPaths(state, SecureWalletName.TREZOR)
  };
}

export const TrezorDecrypt = connect(mapStateToProps)(TrezorDecryptClass);
