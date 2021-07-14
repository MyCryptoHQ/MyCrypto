import { PureComponent } from 'react';

import { DeterministicWallet, DerivationPath as DPath } from '@mycrypto/wallets';

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
import { HDWallets } from '@features/AddAccount';
import { getDPath, getDPaths } from '@services/EthService';
import { INetworkContext, useNetworks } from '@services/Store';
import { getWallet, WalletFactory } from '@services/WalletService';
import translate, { Trans, translateRaw } from '@translations';
import { BusyBottomConfig, FormData, TAddress, WalletId } from '@types';
import { withHook } from '@utils';

import UnsupportedNetwork from './UnsupportedNetwork';
import './LedgerNano.scss';

interface OwnProps {
  wallet: TObject;
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

type Props = OwnProps;

const WalletService = WalletFactory[WalletId.LEDGER_NANO_S];

class LedgerNanoSDecryptClass extends PureComponent<Props & INetworkContext, State> {
  public state: State = {
    dPath:
      getDPath(this.props.getNetworkById(this.props.formData.network), WalletId.LEDGER_NANO_S) ||
      getDPaths(this.props.networks, WalletId.LEDGER_NANO_S)[0],
    error: null,
    isLoading: false,
    isConnected: false,
    wallet: getWallet(WalletId.LEDGER_NANO_S)!
  };

  public render() {
    const { dPath, isLoading, isConnected, error } = this.state;
    const networks = this.props.networks;
    const network = this.props.getNetworkById(this.props.formData.network);

    if (!dPath) {
      return <UnsupportedNetwork walletType={translateRaw('X_LEDGER')} network={network} />;
    }

    if (window.location.protocol !== 'https:') {
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
            walletId={WalletId.LEDGER_NANO_S}
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
        <Box p="2.5em">
          <Heading fontSize="32px" textAlign="center" fontWeight="bold">
            {translate('UNLOCK_WALLET')}{' '}
            {translateRaw('YOUR_WALLET_TYPE', { $walletType: translateRaw('X_LEDGER') })}
          </Heading>
          <div className="LedgerPanel-description-content">
            <div className="LedgerPanel-description">
              {translate('LEDGER_TIP', { $network: network.id })}
              <div className="LedgerPanel-image">
                <Icon type="ledger-icon-lg" />
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
                  {translate('ADD_LEDGER_SCAN')}
                </Button>
              )}
              {error && <InlineMessage>{error}</InlineMessage>}
            </div>
            <div className="LedgerPanel-footer">
              <BusyBottom type={BusyBottomConfig.LEDGER} />
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
      .then(() => this.setState({ isLoading: false, isConnected: true }))
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
      this.props.onUnlock(await WalletService.init({ address, dPath: this.state.dPath, index }));
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
        getDPath(network, WalletId.LEDGER_NANO_S) || getDPaths(networks, WalletId.LEDGER_NANO_S)[0]
    });
  }
}

export const LedgerNanoSDecrypt = withHook(useNetworks)(LedgerNanoSDecryptClass);
