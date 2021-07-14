import { PureComponent } from 'react';

import { DerivationPath as DPath } from '@mycrypto/wallets';

import ConnectTrezor from '@assets/images/icn-connect-trezor-new.svg';
import { Box, BusyBottom, Button, Heading, InlineMessage, Spinner } from '@components';
import { HDWallets } from '@features/AddAccount';
import { getDPath, getDPaths } from '@services/EthService';
import { INetworkContext, useNetworks } from '@services/Store';
import { getWallet, WalletFactory } from '@services/WalletService';
import translate, { translateRaw } from '@translations';
import { BusyBottomConfig, FormData, TAddress, WalletId } from '@types';
import { withHook } from '@utils';

import './Trezor.scss';
import UnsupportedNetwork from './UnsupportedNetwork';

//@todo: conflicts with comment in walletDecrypt -> onUnlock method
interface OwnProps {
  formData: FormData;
  onUnlock(param: any): void;
}

// @todo: nearly duplicates ledger component props
interface State {
  dPath: DPath;
  error: string | null;
  isLoading: boolean;
  isConnected: boolean;
}

const WalletService = WalletFactory[WalletId.TREZOR];
const wallet = getWallet(WalletId.TREZOR);

class TrezorDecryptClass extends PureComponent<OwnProps & INetworkContext, State> {
  public state: State = {
    dPath:
      getDPath(this.props.getNetworkById(this.props.formData.network), WalletId.TREZOR) ||
      getDPaths(this.props.networks, WalletId.TREZOR)[0],
    error: null,
    isLoading: false,
    isConnected: false
  };

  public render() {
    const { dPath, isLoading, isConnected, error } = this.state;
    const networks = this.props.networks;
    const network = this.props.getNetworkById(this.props.formData.network);

    if (!dPath) {
      return <UnsupportedNetwork walletType={translateRaw('x_Trezor')} network={network} />;
    }

    if (isConnected) {
      return (
        <div className="Mnemonic-dpath">
          <HDWallets
            network={network}
            walletId={WalletId.TREZOR}
            dPath={dPath}
            dPaths={getDPaths(networks, WalletId.TREZOR)}
            onCancel={this.handleCancel}
            onConfirmAddress={this.handleUnlock}
            onPathChange={this.handlePathChange}
          />
        </div>
      );
    } else {
      return (
        <Box p="2.5em">
          <Heading fontSize="32px" textAlign="center" fontWeight="bold">
            {translate('UNLOCK_WALLET')}{' '}
            {translateRaw('YOUR_WALLET_TYPE', { $walletType: translateRaw('X_TREZOR') })}
          </Heading>
          <div className="TrezorDecrypt">
            <div className="TrezorDecrypt-description">
              {translate('TREZOR_TIP')}
              <div className="TrezorDecrypt-img">
                <img src={ConnectTrezor} />
              </div>
            </div>

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
            {error && <InlineMessage>{error}</InlineMessage>}
            <div className="TrezorDecrypt-footer">
              <BusyBottom type={BusyBottomConfig.TREZOR} />
            </div>
          </div>
        </Box>
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

    wallet!
      .getAddress(dPath, 0)
      .then(() => {
        this.setState({ isLoading: false, isConnected: true });
      })
      .catch((err) => {
        this.setState({
          error: err.message,
          isLoading: false
        });
      });
  };

  private handleCancel = () => {
    this.reset();
  };

  private handleUnlock = async (address: TAddress, index: number) => {
    try {
      this.props.onUnlock(await WalletService.init({ address, dPath: this.state.dPath, index }));
    } catch (err) {
      console.error(err);
    }
  };

  private handleNullConnect = (): void => {
    this.handleConnect(this.state.dPath);
  };

  private reset() {
    const networks = this.props.networks;
    const network = this.props.getNetworkById(this.props.formData.network);
    this.setState({
      dPath: getDPath(network, WalletId.TREZOR) || getDPaths(networks, WalletId.TREZOR)[0]
    });
  }
}

export const TrezorDecrypt = withHook(useNetworks)(TrezorDecryptClass);
