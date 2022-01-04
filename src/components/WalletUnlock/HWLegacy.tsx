import { PureComponent } from 'react';

import { DeterministicWallet, DerivationPath as DPath } from '@mycrypto/wallets';
import { AnyAction, bindActionCreators, Dispatch } from '@reduxjs/toolkit';
import { connect, ConnectedProps } from 'react-redux';

import {
  Box,
  BusyBottom,
  Button,
  Heading,
  Icon,
  InlineMessage,
  LinkApp,
  Spinner
} from '@components';
import { TIcon } from '@components/Icon';
import { HARDWARE_CONFIG, IWalletConfig } from '@config';
import { HDWallets } from '@features/AddAccount';
import { getDPath, getDPaths } from '@services/EthService';
import { INetworkContext, useNetworks } from '@services/Store';
import { getWallet, WalletFactory } from '@services/WalletService';
import { connectWallet } from '@store';
import translate, { Trans, translateRaw } from '@translations';
import { DPathFormat, FormData, HardwareWalletId, TAddress, WalletId } from '@types';
import { withHook } from '@utils';

import UnsupportedNetwork from './UnsupportedNetwork';
import './LedgerNano.scss';

interface OwnProps {
  wallet: IWalletConfig;
  walletParams: any;
  formData: FormData;
  onUnlock(param: any): void;
}

interface State {
  dPath: DPath;
  error: string | null;
  isConnected: boolean;
  isLoading: boolean;
  wallet: DeterministicWallet;
}

class HWLegacyClass extends PureComponent<Props & INetworkContext, State> {
  public state: State = {
    dPath:
      getDPath(
        this.props.getNetworkById(this.props.formData.network),
        this.props.wallet.id as DPathFormat
      ) ?? getDPaths(this.props.networks, this.props.wallet.id as DPathFormat)[0],
    error: null,
    isLoading: false,
    isConnected: false,
    wallet: getWallet(this.props.wallet.id, this.props.walletParams)!
  };

  public render() {
    const { dPath, isLoading, isConnected, error } = this.state;
    const networks = this.props.networks;
    const network = this.props.getNetworkById(this.props.formData.network);

    if (!dPath) {
      return (
        <UnsupportedNetwork walletType={translateRaw(this.props.wallet.lid)} network={network} />
      );
    }

    if (this.props.wallet.id === WalletId.LEDGER_NANO_S && window.location.protocol !== 'https:') {
      return (
        <div className="Panel">
          <div className="alert alert-danger">
            <Trans
              id="UNLOCKING_LEDGER_ONLY_POSSIBLE_ON_OVER_HTTPS"
              variables={{
                $link: () => (
                  <LinkApp href="https://mycrypto.com" isExternal={true}>
                    MyCrypto.com
                  </LinkApp>
                )
              }}
            />
          </div>
        </div>
      );
    }

    if (isConnected) {
      return (
        <div className="Mnemonic-dpath">
          <HDWallets
            network={network}
            wallet={this.state.wallet}
            dPath={dPath}
            dPaths={getDPaths(networks, this.props.wallet.id as DPathFormat)}
            onCancel={this.handleCancel}
            onConfirmAddress={this.handleUnlock}
            onPathChange={this.handlePathChange}
          />
        </div>
      );
    } else {
      return (
        <Box>
          <Heading fontSize="32px" textAlign="center" fontWeight="bold" mt="0">
            {translate('UNLOCK_WALLET')}{' '}
            {translateRaw('YOUR_WALLET_TYPE', { $walletType: translateRaw(this.props.wallet.lid) })}
          </Heading>
          <div className="LedgerPanel-description-content">
            <div className="LedgerPanel-description">
              {translate(
                HARDWARE_CONFIG[this.props.wallet.id as HardwareWalletId].unlockTipTransKey,
                { $network: network.id }
              )}
              <div className="LedgerPanel-image">
                <Icon
                  type={HARDWARE_CONFIG[this.props.wallet.id as HardwareWalletId].iconId as TIcon}
                />
              </div>
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
                  {translate(
                    HARDWARE_CONFIG[this.props.wallet.id as HardwareWalletId].scanTransKey
                  )}
                </Button>
              )}
              {error && <InlineMessage>{error}</InlineMessage>}
            </div>
            <div className="LedgerPanel-footer">
              <BusyBottom
                type={HARDWARE_CONFIG[this.props.wallet.id as HardwareWalletId].busyBottom}
              />
            </div>
          </div>
        </Box>
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

    this.state.wallet
      .getAddress(dPath, 0)
      .then(() => {
        this.setState({ isLoading: false, isConnected: true });
        this.props.connectWallet(this.state.wallet);
      })
      .catch((err) =>
        this.setState({
          error: err.message,
          isLoading: false
        })
      );
  };

  private handleCancel = () => {
    this.reset();
  };

  private handleUnlock = async (address: TAddress, index: number) => {
    try {
      const WalletService = WalletFactory[this.props.wallet.id as HardwareWalletId];
      const instance = await WalletService.init({
        address,
        dPath: this.state.dPath,
        index,
        params: this.props.walletParams
      });
      this.props.connectWallet(instance);
      this.props.onUnlock(instance);
    } catch (err) {
      console.error(err);
    }
  };

  private handleNullConnect = (): void => {
    return this.handleConnect(this.state.dPath);
  };

  private reset() {
    const networks = this.props.networks;
    const network = this.props.getNetworkById(this.props.formData.network);
    this.setState({
      isConnected: false,
      dPath:
        getDPath(network, this.props.wallet.id as DPathFormat) ??
        getDPaths(networks, this.props.wallet.id as DPathFormat)[0]
    });
  }
}

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators({ connectWallet }, dispatch);

const connector = connect(() => ({}), mapDispatchToProps);
type Props = ConnectedProps<typeof connector> & OwnProps;

export const HWLegacy = withHook(useNetworks)(connector(HWLegacyClass));
