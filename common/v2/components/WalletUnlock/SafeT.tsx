import React, { PureComponent } from 'react';

import translate, { translateRaw } from 'v2/translations';
import { Spinner } from 'v2/components';

import { NetworkContext } from 'v2/services/Store';
import { getDPath, getDPaths } from 'v2/services';
import { WalletFactory, ChainCodeResponse } from 'v2/services/WalletService';
import { WalletId, FormData } from 'v2/types';
import UnsupportedNetwork from './UnsupportedNetwork';
import DeterministicWallets from './DeterministicWallets';
import './SafeT.scss';
import SafeTIcon from 'common/assets/images/icn-safet-mini-new.svg';

//todo: conflicts with comment in walletDecrypt -> onUnlock method
interface OwnProps {
  formData: FormData;
  onUnlock(param: any): void;
}

// todo: nearly duplicates ledger component props
interface State {
  publicKey: string;
  chainCode: string;
  dPath: DPath;
  error: string | null;
  isLoading: boolean;
}

const WalletService = WalletFactory(WalletId.SAFE_T_MINI);

class SafeTminiDecryptClass extends PureComponent<OwnProps, State> {
  public static contextType = NetworkContext;
  public state: State = {
    publicKey: '',
    chainCode: '',
    dPath:
      getDPath(this.context.getNetworkById(this.props.formData.network), WalletId.SAFE_T_MINI) ||
      getDPaths(this.context.networks, WalletId.SAFE_T_MINI)[0],
    error: null,
    isLoading: false
  };

  public render() {
    const { dPath, publicKey, chainCode, error, isLoading } = this.state;
    const showErr = error ? 'is-showing' : '';
    const networks = this.context.networks;
    const network = this.context.getNetworkById(this.props.formData.network);

    if (!dPath) {
      return <UnsupportedNetwork walletType={translateRaw('X_SAFE_T')} network={network} />;
    }

    if (publicKey && chainCode) {
      return (
        <div className="Mnemonic-dpath">
          <DeterministicWallets
            network={network}
            publicKey={publicKey}
            chainCode={chainCode}
            dPath={dPath}
            dPaths={getDPaths(networks, WalletId.SAFE_T_MINI)}
            onCancel={this.handleCancel}
            onConfirmAddress={this.handleUnlock}
            onPathChange={this.handlePathChange}
          />
        </div>
      );
    } else {
      // todo: update help link
      return (
        <div className="Panel">
          <div className="Panel-title">
            {translate('UNLOCK_WALLET')} {`Your ${translateRaw('X_SAFE_T')}`}
          </div>
          <div className="SafeTminiDecrypt">
            <div className="SafeTminiDecrypt-description">
              {translate('SAFET_MINI_DESCRIPTION')}
            </div>
            <div className="SafeTminiDecrypt-img">
              <img src={SafeTIcon} />
            </div>
            <div className="SafeTMini-button-container">
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
            </div>

            <div className="SafeTminiDecrypt-description-footer">
              {translate('SAFET_MINI_HELP')}
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

    WalletService.getChainCode(dPath.value)
      .then((res: ChainCodeResponse) => {
        this.setState({
          dPath,
          publicKey: res.publicKey,
          chainCode: res.chainCode,
          isLoading: false
        });
      })
      .catch((err: any) => {
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
    this.props.onUnlock(WalletService.init(address, this.state.dPath.value, index));
  };

  private handleNullConnect = (): void => {
    this.handleConnect(this.state.dPath);
  };

  private reset() {
    const networks = this.context.networks;
    const network = this.context.getNetworkById(this.props.formData.network);
    this.setState({
      publicKey: '',
      chainCode: '',
      dPath: getDPath(network, WalletId.SAFE_T_MINI) || getDPaths(networks, WalletId.SAFE_T_MINI)[0]
    });
  }
}

export const SafeTminiDecrypt = SafeTminiDecryptClass;
