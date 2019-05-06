import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { SecureWalletName } from 'config';
import translate, { translateRaw } from 'translations';
import { SafeTWallet } from 'libs/wallet';
import { AppState } from 'features/reducers';
import { configSelectors, configNetworksStaticSelectors } from 'features/config';
import { Spinner } from 'components/ui';
import UnsupportedNetwork from './UnsupportedNetwork';
import DeterministicWallets from './DeterministicWallets';
import './SafeT.scss';
import SafeTIcon from 'common/assets/images/icn-safet-mini-new.svg';

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

class SafeTminiDecryptClass extends PureComponent<Props, State> {
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
      return <UnsupportedNetwork walletType={translateRaw('X_SAFE_T')} />;
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
      // todo: update help link
      return (
        <div className="SafeTminiDecrypt">
          <div className="SafeTminiDecrypt-description">{translate('SAFET_MINI_DESCRIPTION')}</div>
          <div className="SafeTminiDecrypt-img">
            <img src={SafeTIcon} />
          </div>
          <div className="SafeTminiDecrypt-unlockButton">
            {isLoading ? (
              <div className="SafeTminiDecrypt-message">
                <Spinner />
                {translate('WALLET_UNLOCKING')}
              </div>
            ) : (
              <button
                className="SafeTminiDecrypt-decrypt btn btn-primary btn-lg btn-block"
                onClick={this.handleNullConnect}
                disabled={isLoading}
              >
                {translate('ADD_SAFE_T_SCAN')}
              </button>
            )}
            <div className={`SafeTminiDecrypt-error alert alert-danger ${showErr}`}>
              {error || '-'}
            </div>
          </div>

          <div className="SafeTminiDecrypt-description-footer">{translate('SAFET_MINI_HELP')}</div>
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

    SafeTWallet.getChainCode(dPath.value)
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
    this.props.onUnlock(new SafeTWallet(address, this.state.dPath.value, index));
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
    dPath: configSelectors.getSingleDPath(state, SecureWalletName.SAFE_T),
    dPaths: configNetworksStaticSelectors.getPaths(state, SecureWalletName.SAFE_T)
  };
}

export const SafeTminiDecrypt = connect(mapStateToProps)(SafeTminiDecryptClass);
