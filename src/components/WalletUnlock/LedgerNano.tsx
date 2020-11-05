import React, { PureComponent } from 'react';

import { Button } from '@mycrypto/ui';

import ledgerIcon from '@assets/images/icn-ledger-nano-large.svg';
import { NewTabLink, Spinner } from '@components';
import { EXT_URLS } from '@config';
import { getDPath, getDPaths, INetworkContext, useNetworks } from '@services';
import { ChainCodeResponse, WalletFactory } from '@services/WalletService';
import translate, { Trans, translateRaw } from '@translations';
import { FormData, WalletId } from '@types';
import { IS_ELECTRON, withHook } from '@utils';

import DeterministicWallets from './DeterministicWallets';
import UnsupportedNetwork from './UnsupportedNetwork';
import './LedgerNano.scss';

interface OwnProps {
  wallet: TObject;
  formData: FormData;
  onUnlock(param: any): void;
}

interface State {
  publicKey: string;
  chainCode: string;
  dPath: DPath;
  error: string | null;
  isLoading: boolean;
}

type Props = OwnProps;

const WalletService = WalletFactory(WalletId.LEDGER_NANO_S);

class LedgerNanoSDecryptClass extends PureComponent<Props & INetworkContext, State> {
  public state: State = {
    publicKey: '',
    chainCode: '',
    dPath:
      getDPath(this.props.getNetworkById(this.props.formData.network), WalletId.LEDGER_NANO_S) ||
      getDPaths(this.props.networks, WalletId.LEDGER_NANO_S)[0],
    error: null,
    isLoading: false
  };

  public render() {
    const { dPath, publicKey, chainCode, isLoading } = this.state;
    const networks = this.props.networks;
    const network = this.props.getNetworkById(this.props.formData.network);

    if (!dPath) {
      return <UnsupportedNetwork walletType={translateRaw('x_Ledger')} network={network} />;
    }

    if (!IS_ELECTRON && window.location.protocol !== 'https:') {
      return (
        <div className="Panel">
          <div className="alert alert-danger">
            <Trans
              id="UNLOCKING_LEDGER_ONLY_POSSIBLE_ON_OVER_HTTPS"
              variables={{
                $newTabLink: () => <NewTabLink href="https://mycrypto.com">MyCrypto.com</NewTabLink>
              }}
            />
          </div>
        </div>
      );
    }

    if (publicKey && chainCode) {
      return (
        <div className="Mnemonic-dpath">
          <DeterministicWallets
            network={network}
            publicKey={publicKey}
            chainCode={chainCode}
            dPath={dPath}
            dPaths={getDPaths(networks, WalletId.LEDGER_NANO_S)}
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
            {translate('UNLOCK_WALLET')}{' '}
            {translateRaw('YOUR_WALLET_TYPE', { $walletType: translateRaw('X_LEDGER') })}
          </div>
          <div className="LedgerPanel-description-content">
            <div className="LedgerPanel-description">
              {translate('LEDGER_TIP')}
              <div className="LedgerPanel-image">
                <img src={ledgerIcon} />
              </div>
              {/* <div className={`LedgerDecrypt-error alert alert-danger ${showErr}`}>
                {error || '-'}
              </div> */}
              {isLoading ? (
                <div className="LedgerPanel-loading">
                  <Spinner /> {translate('WALLET_UNLOCKING')}
                </div>
              ) : (
                <Button
                  className="LedgerPanel-description-button"
                  onClick={this.handleNullConnect}
                  disabled={isLoading}
                >
                  {translate('ADD_LEDGER_SCAN')}
                </Button>
              )}
            </div>
            <div className="LedgerPanel-footer">
              {translate('LEDGER_REFERRAL_2', { $url: EXT_URLS.LEDGER_REFERRAL.url })}
            </div>
          </div>
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

    WalletService.getChainCode(dPath.value)
      .then((res: ChainCodeResponse) => {
        this.setState({
          publicKey: res.publicKey,
          chainCode: res.chainCode,
          isLoading: false
        });
      })
      .catch((err: any) => {
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
    this.props.onUnlock(WalletService.init(address, this.state.dPath.value, index));
  };

  private handleNullConnect = (): void => {
    return this.handleConnect(this.state.dPath);
  };

  private reset() {
    const networks = this.props.networks;
    const network = this.props.getNetworkById(this.props.formData.network);
    this.setState({
      publicKey: '',
      chainCode: '',
      dPath:
        getDPath(network, WalletId.LEDGER_NANO_S) || getDPaths(networks, WalletId.LEDGER_NANO_S)[0]
    });
  }
}

export const LedgerNanoSDecrypt = withHook(useNetworks)(LedgerNanoSDecryptClass);
