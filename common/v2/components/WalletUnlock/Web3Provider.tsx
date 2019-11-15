import React, { Component } from 'react';

import translate from 'v2/translations';
import { WALLETS_CONFIG, IWalletConfig } from 'v2/config';
import { WalletId, FormData } from 'v2/types';
import { InlineErrorMsg, NewTabLink } from 'v2/components';
import { WalletFactory } from 'v2/services/WalletService';
import { FormDataActionType as ActionType } from 'v2/features/AddAccount/types';
import './Web3Provider.scss';
import { getWeb3Config } from 'v2/utils/web3';

interface Props {
  formDispatch: any;
  formData: FormData;
  wallet: object;
  onUnlock(param: any): void;
}

interface State {
  web3Unlocked: boolean | undefined;
  web3ProviderSettings: IWalletConfig;
}

const WalletService = WalletFactory(WalletId.METAMASK);

class Web3ProviderDecrypt extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      web3Unlocked: undefined,
      web3ProviderSettings: this.getWeb3Provider()
    };
    this.unlockWallet = this.unlockWallet.bind(this);
  }

  public render() {
    const { web3Unlocked, web3ProviderSettings: provider } = this.state;
    return (
      <div className="Panel">
        <div className="Panel-title">
          {translate(`ADD_ACCOUNT_WEB3_TITLE`, { $walletId: provider.name })}
        </div>
        <div className="Panel-description">{translate(`ADD_ACCOUNT_WEB3_DESC`)}</div>
        <div className="Panel-content">
          <div className="Web3-img-container">
            <div className="Web3-img">
              <img src={provider.icon} />
            </div>
          </div>
          <button className="btn btn-primary btn-lg btn-block" onClick={this.unlockWallet}>
            {translate(`ADD_WEB3`, { $walletId: provider.name })}
          </button>

          {web3Unlocked === false && (
            <InlineErrorMsg>
              {translate('WEB3_ONUNLOCK_NOT_FOUND_ERROR', { $walletId: provider.name })}
            </InlineErrorMsg>
          )}
        </div>
        <div className="Web3-footer">
          <div>
            {translate(`ADD_ACCOUNT_WEB3_FOOTER`, { $walletId: provider.name })}{' '}
            <NewTabLink
              content={translate(`ADD_ACCOUNT_WEB3_FOOTER_LINK`, { $walletId: provider.name })}
              href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en"
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
    try {
      const walletPayload = await WalletService.init();
      if (!walletPayload) {
        throw new Error('Failed to unlock web3');
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
    if (window.web3) {
      return getWeb3Config();
    }
    return WALLETS_CONFIG[WalletId.METAMASK]; //Default to MetaMask
  }
}

export default Web3ProviderDecrypt;
