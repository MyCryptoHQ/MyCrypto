import React, { PureComponent } from 'react';
import { Button } from '@mycrypto/ui';
import { Spinner, NewTabLink } from 'v2/components';
import translate, { translateRaw } from 'v2/translations';
import { WalletId, FormData } from 'v2/types';
import { getDPath, getDPaths } from 'v2/services';

import { NetworkContext } from 'v2/services/Store';
import { WalletFactory, ChainCodeResponse } from 'v2/services/WalletService';

import UnsupportedNetwork from './UnsupportedNetwork';
import DeterministicWallets from './DeterministicWallets';
import './LedgerNano.scss';
import ledgerIcon from 'common/assets/images/icn-ledger-nano-large.svg';
import { EXT_URLS } from 'v2/config';
interface OwnProps {
  wallet: object;
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

class LedgerNanoSDecryptClass extends PureComponent<Props, State> {
  public static contextType = NetworkContext;
  public state: State = {
    publicKey: '',
    chainCode: '',
    dPath:
      getDPath(this.context.getNetworkById(this.props.formData.network), WalletId.LEDGER_NANO_S) ||
      getDPaths(this.context.networks, WalletId.LEDGER_NANO_S)[0],
    error: null,
    isLoading: false
  };

  public render() {
    const { dPath, publicKey, chainCode, isLoading } = this.state;
    const networks = this.context.networks;
    const network = this.context.getNetworkById(this.props.formData.network);

    if (!dPath) {
      return <UnsupportedNetwork walletType={translateRaw('x_Ledger')} network={network} />;
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
            {translate('UNLOCK_WALLET')} {`Your ${translateRaw('X_LEDGER')}`}
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
              {/*<br />
              {translate('LEDGER_HELP_LINK')} */}
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
    const networks = this.context.networks;
    const network = this.context.getNetworkById(this.props.formData.network);
    this.setState({
      publicKey: '',
      chainCode: '',
      dPath:
        getDPath(network, WalletId.LEDGER_NANO_S) || getDPaths(networks, WalletId.LEDGER_NANO_S)[0]
    });
  }
}

export const LedgerNanoSDecrypt = LedgerNanoSDecryptClass;
