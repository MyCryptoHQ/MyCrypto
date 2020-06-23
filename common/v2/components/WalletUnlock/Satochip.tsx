import React, { PureComponent } from 'react';
import { Button } from '@mycrypto/ui';

import translate, { translateRaw } from 'v2/translations';
import ConnectSatochip from 'common/assets/images/icn-connect-satochip-new.svg';
import { Spinner } from 'v2/components';

import { WalletId, FormData } from 'v2/types';
import { NetworkContext } from 'v2/services/Store';
import { getDPath, getDPaths } from 'v2/services';
import { WalletFactory, ChainCodeResponse } from 'v2/services/WalletService';
import DeterministicWallets from './DeterministicWallets';
import './Satochip.scss';
import UnsupportedNetwork from './UnsupportedNetwork';

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

console.log('Log: components/WalletUnlock/Satochip.tsx: call WalletFactory()'); //debugSatochip
const WalletService = WalletFactory(WalletId.SATOCHIP);
console.log('Log: components/WalletUnlock/Satochip.tsx: end call WalletFactory()'); //debugSatochip

class SatochipDecryptClass extends PureComponent<OwnProps, State> {
  public static contextType = NetworkContext;
  public state: State = {
    publicKey: '',
    chainCode: '',
    dPath:
      getDPath(this.context.getNetworkByName(this.props.formData.network), WalletId.SATOCHIP) ||
      getDPaths(this.context.networks, WalletId.SATOCHIP)[0],
    error: null,
    isLoading: false
  };

  public render() {
    console.log('Log: components/WalletUnlock/Satochip.tsx: in render()'); //debugSatochip
    const { dPath, publicKey, chainCode, isLoading } = this.state;
    const networks = this.context.networks;
    const network = this.context.getNetworkByName(this.props.formData.network);
    console.log(' dpath: ' + typeof dPath); //debugSatochip
    console.log(' dpath: ', dPath); //debugSatochip

    if (!dPath) {
      return <UnsupportedNetwork walletType={translateRaw('x_Satochip')} network={network} />;
      //return <UnsupportedNetwork walletType={typeof(dPath)} network={network} />;
    }

    if (publicKey && chainCode) {
      return (
        <div className="Mnemonic-dpath">
          <DeterministicWallets
            network={network}
            publicKey={publicKey}
            chainCode={chainCode}
            dPath={dPath}
            dPaths={getDPaths(networks, WalletId.SATOCHIP)}
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
            {translate('UNLOCK_WALLET')} {`Your ${translateRaw('X_SATOCHIP')}`}
          </div>
          <div className="SatochipDecrypt">
            <div className="SatochipDecrypt-description">
              {translate('SATOCHIP_TIP')}
              <div className="SatochipDecrypt-img">
                <img src={ConnectSatochip} />
              </div>
            </div>
            {/* <div className={`SatochipDecrypt-error alert alert-danger ${showErr}`}>
              {error || '-'}
            </div> */}

            {isLoading ? (
              <div className="SatochipDecrypt-loading">
                <Spinner /> {translate('WALLET_UNLOCKING')}
              </div>
            ) : (
              <Button
                className="SatochipDecrypt-button"
                onClick={this.handleNullConnect}
                disabled={isLoading}
              >
                {translate('ADD_SATOCHIP_SCAN')}
              </Button>
            )}
            <div className="SatochipDecrypt-footer">
              {translate('ORDER_SATOCHIP')} <br />
              {translate('HOWTO_SATOCHIP')}
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
    console.log('Log: components/WalletUnlock/Satochip.tsx: in handleConnect()'); //debugSatochip
    this.setState({
      isLoading: true,
      error: null
    });
    console.log(
      'Log: components/WalletUnlock/Satochip.tsx: in handleConnect(): =>WalletService.getChainCode'
    ); //debugSatochip
    WalletService.getChainCode(dPath.value)
      .then((res: ChainCodeResponse) => {
        console.log(
          'Log: components/WalletUnlock/Satochip.tsx: in handleConnect(): =>WalletService.getChainCode().then()'
        ); //debugSatochip
        console.log('Received ChainCodeResponse: ', res); //debugSatochip
        this.setState({
          dPath,
          publicKey: res.publicKey,
          chainCode: res.chainCode,
          isLoading: false
        });
      })
      .catch((err: any) => {
        console.log(
          'Log: components/WalletUnlock/Satochip.tsx: in handleConnect(): =>WalletService.getChainCode.catch()'
        ); //debugSatochip
        console.log(
          'Log: components/WalletUnlock/Satochip.tsx: in handleConnect(): =>error:' + err.message
        ); //debugSatochip
        this.setState({
          error: err.message,
          isLoading: false
        });
      });
    console.log(
      'Log: components/WalletUnlock/Satochip.tsx: in handleConnect(): =>WalletService.getChainCode finished!'
    ); //debugSatochip
  };

  private handleCancel = () => {
    this.reset();
  };

  private handleUnlock = (address: string, index: number) => {
    this.props.onUnlock(WalletService.init(address, this.state.dPath.value, index));
    this.reset();
  };

  private handleNullConnect = (): void => {
    console.log('Log: components/WalletUnlock/Satochip.tsx: in handleNullConnect()'); //debugSatochip
    this.handleConnect(this.state.dPath);
  };

  private reset() {
    const networks = this.context.networks;
    const network = this.context.getNetworkByName(this.props.formData.network);
    this.setState({
      publicKey: '',
      chainCode: '',
      dPath: getDPath(network, WalletId.SATOCHIP) || getDPaths(networks, WalletId.SATOCHIP)[0]
    });
  }
}

export const SatochipDecrypt = SatochipDecryptClass;
