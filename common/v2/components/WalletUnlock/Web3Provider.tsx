import React, { Component as ComponentProps } from 'react';
import * as R from 'ramda';

import translate, { translateRaw } from 'v2/translations';
import { WALLETS_CONFIG, IWalletConfig } from 'v2/config';
import { WalletId, FormData, Network } from 'v2/types';
import { InlineMessage, NewTabLink } from 'v2/components';
import { withContext, hasWeb3Provider, useScreenSize } from 'v2/utils';
import {
  SettingsContext,
  ISettingsContext,
  INetworkContext,
  NetworkContext,
  NetworkUtils
} from 'v2/services/Store';
import { WalletFactory } from 'v2/services/WalletService';
import { FormDataActionType as ActionType } from 'v2/features/AddAccount/types';
import './Web3Provider.scss';
import { getWeb3Config } from 'v2/utils/web3';

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
    return (
      <div className="Panel">
        <div className="Panel-title">
          {translate(isDefault ? 'ADD_ACCOUNT_WEB3_TITLE_DEFAULT' : 'ADD_ACCOUNT_WEB3_TITLE', {
            $walletId: provider.name
          })}
        </div>
        <div className="Panel-description">{translate(`ADD_ACCOUNT_WEB3_DESC`)}</div>
        <div className="Panel-content">
          <div className="Web3-img-container">
            <div className={isDefault ? 'Web3-img-default' : 'Web3-img'}>
              <img src={provider.icon} />
            </div>
          </div>
          <button className="btn btn-primary btn-lg btn-block" onClick={this.unlockWallet}>
            {translate(isDefault ? 'ADD_WEB3_DEFAULT' : 'ADD_WEB3', { $walletId: provider.name })}
          </button>

          {web3Unlocked === false && (
            <InlineMessage>
              {translate('WEB3_ONUNLOCK_NOT_FOUND_ERROR', { $walletId: provider.name })}
            </InlineMessage>
          )}
        </div>
        <div className="Web3-footer">
          <div>
            {translate(isDefault ? 'ADD_ACCOUNT_WEB3_FOOTER_DEFAULT' : 'ADD_ACCOUNT_WEB3_FOOTER', {
              $walletId: provider.name
            })}{' '}
            <NewTabLink
              content={translate(`ADD_ACCOUNT_WEB3_FOOTER_LINK`, { $walletId: provider.name })}
              href={
                provider.install
                  ? provider.install.getItLink
                  : translateRaw(
                      isMobile
                        ? `ADD_ACCOUNT_WEB3_FOOTER_LINK_HREF_MOBILE`
                        : `ADD_ACCOUNT_WEB3_FOOTER_LINK_HREF_DESKTOP`
                    )
              }
            />
          </div>
          <div>
            <NewTabLink
              content={translate('ADD_ACCOUNT_WEB3_HELP', { $walletId: provider.name })}
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

export default R.pipe(
  withResponsive,
  withContext(SettingsContext),
  withContext(NetworkContext)
)(Web3ProviderDecrypt);
