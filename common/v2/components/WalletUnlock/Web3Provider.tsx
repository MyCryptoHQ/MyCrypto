import React, { Component as ComponentProps } from 'react';
import pipe from 'ramda/src/pipe';

import translate, { translateRaw } from '@translations';
import { WALLETS_CONFIG, IWalletConfig } from '@config';
import { WalletId, FormData, Network } from '@types';
import { InlineMessage, NewTabLink } from '@components';
import { withContext, hasWeb3Provider, useScreenSize } from '@utils';
import {
  SettingsContext,
  ISettingsContext,
  INetworkContext,
  NetworkContext,
  NetworkUtils
} from '@services/Store';
import { WalletFactory } from '@services/WalletService';
import { FormDataActionType as ActionType } from '@features/AddAccount/types';
import './Web3Provider.scss';
import { getWeb3Config } from '@utils/web3';
import { ANALYTICS_CATEGORIES, AnalyticsService } from '@services';

interface Props {
  formDispatch: any;
  formData: FormData;
  wallet: object;
  isMobile: boolean;
  onUnlock(param: any): void;
}

interface State {
  web3Unlocked: boolean | undefined;
  web3ProviderSettings: IWalletConfig;
}

const WalletService = WalletFactory(WalletId.WEB3);

class Web3ProviderDecrypt extends ComponentProps<
  Props & ISettingsContext & INetworkContext,
  State
> {
  constructor(props: Props & ISettingsContext & INetworkContext) {
    super(props);
    this.state = {
      web3Unlocked: undefined,
      web3ProviderSettings: this.getWeb3Provider()
    };
    this.unlockWallet = this.unlockWallet.bind(this);
  }

  public render() {
    const { web3Unlocked, web3ProviderSettings: provider } = this.state;
    const { isMobile } = this.props;
    const isDefault = provider.id === WalletId.WEB3;
    const transProps = { $walletId: provider.name };

    return (
      <div className="Panel">
        <div className="Panel-title">
          {isDefault
            ? translate('ADD_ACCOUNT_WEB3_TITLE_DEFAULT', transProps)
            : translate('ADD_ACCOUNT_WEB3_TITLE', transProps)}
        </div>
        <div className="Panel-description">{translate(`ADD_ACCOUNT_WEB3_DESC`)}</div>
        <div className="Panel-content">
          <div className="Web3-img-container">
            <div className={isDefault ? 'Web3-img-default' : 'Web3-img'}>
              <img src={provider.icon} />
            </div>
          </div>
          <button className="btn btn-primary btn-lg btn-block" onClick={this.unlockWallet}>
            {isDefault
              ? translate('ADD_WEB3_DEFAULT', transProps)
              : translate('ADD_WEB3', transProps)}
          </button>

          {web3Unlocked === false && (
            <InlineMessage>{translate('WEB3_ONUNLOCK_NOT_FOUND_ERROR', transProps)}</InlineMessage>
          )}
        </div>
        <div className="Web3-footer">
          <div>
            {isDefault
              ? translate('ADD_ACCOUNT_WEB3_FOOTER_DEFAULT', transProps)
              : translate('ADD_ACCOUNT_WEB3_FOOTER', transProps)}{' '}
            <NewTabLink
              content={translate(`ADD_ACCOUNT_WEB3_FOOTER_LINK`, transProps)}
              href={
                provider.install
                  ? provider.install.getItLink
                  : isMobile
                  ? translateRaw('ADD_ACCOUNT_WEB3_FOOTER_LINK_HREF_MOBILE')
                  : translateRaw(`ADD_ACCOUNT_WEB3_FOOTER_LINK_HREF_DESKTOP`)
              }
            />
          </div>
          <div>
            <NewTabLink
              content={translate('ADD_ACCOUNT_WEB3_HELP', transProps)}
              href={`${provider.helpLink}`}
            />
          </div>
        </div>
      </div>
    );
  }

  public async unlockWallet() {
    const { updateSettingsNode, addNodeToNetwork, networks } = this.props;
    const handleUnlock = (network: Network) => {
      updateSettingsNode('web3');
      addNodeToNetwork(NetworkUtils.createWeb3Node(), network);
    };

    try {
      const walletPayload = await WalletService.init(networks, handleUnlock);
      if (!walletPayload) {
        throw new Error('Failed to unlock web3 wallet');
      }
      // If accountType is defined, we are in the AddAccountFlow
      if (this.props.formData.accountType) {
        AnalyticsService.instance.track(
          ANALYTICS_CATEGORIES.ADD_WEB3_ACCOUNT,
          `${this.state.web3ProviderSettings.name} added`
        );
        const network = walletPayload.network;
        this.props.formDispatch({
          type: ActionType.SELECT_NETWORK,
          payload: { network }
        });
      }
      this.props.onUnlock(walletPayload);
    } catch (e) {
      this.setState({ ...this.state, web3Unlocked: false });
    }
  }

  private getWeb3Provider() {
    if (hasWeb3Provider()) {
      return getWeb3Config();
    }
    return WALLETS_CONFIG[WalletId.WEB3]; //Default to Web3
  }
}

const withResponsive = (Component: any) => (ownProps: any) => {
  const { isMobile } = useScreenSize();
  return <Component {...ownProps} isMobile={isMobile} />;
};

export default pipe(
  withResponsive,
  withContext(SettingsContext),
  withContext(NetworkContext)
)(Web3ProviderDecrypt);
