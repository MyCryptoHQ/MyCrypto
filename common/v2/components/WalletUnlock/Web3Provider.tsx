import React, { Component } from 'react';

import translate, { translateRaw } from 'translations';
import { NewTabLink } from 'components/ui';
import { KNOWLEDGE_BASE_URL as KB_URL } from 'v2/config';
import { WalletId, FormData } from 'v2/types';
import { InlineErrorMsg } from 'v2/components';
import { WalletFactory } from 'v2/services/WalletService';
import { FormDataActionType as ActionType } from 'v2/features/AddAccount/types';
import './Web3Provider.scss';
import MetamaskSVG from 'common/assets/images/wallets/metamask-2.svg';
import TrustWalletSVG from 'common/assets/images/wallets/trust-2.svg';

interface Props {
  formDispatch: any;
  formData: FormData;
  wallet: object;
  onUnlock(param: any): void;
}

interface IWeb3ProviderSettings {
  name: string;
  icon: any;
}

interface State {
  web3Unlocked: boolean | undefined;
  web3ProviderSettings: IWeb3ProviderSettings;
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
    const { web3Unlocked } = this.state;
    return (
      <div className="Panel">
        <div className="Panel-title">
          {translate(`ADD_ACCOUNT_${this.state.web3ProviderSettings.name}_TITLE`)}
        </div>
        <div className="Panel-description">
          {translate(`ADD_ACCOUNT_${this.state.web3ProviderSettings.name}_TITLE`)}
        </div>
        <div className="Panel-content">
          <div className="MetaMask-img-container">
            <div className="MetaMask-img">
              <img src={this.state.web3ProviderSettings.icon} />
            </div>
          </div>
          <button className="btn btn-primary btn-lg btn-block" onClick={this.unlockWallet}>
            {translate(`ADD_${this.state.web3ProviderSettings.name}`)}
          </button>

          {web3Unlocked === false && (
            <InlineErrorMsg>{translateRaw('WEB3_ONUNLOCK_NOT_FOUND_ERROR')}</InlineErrorMsg>
          )}
        </div>
        {this.getWeb3Footer(this.state.web3ProviderSettings.name)}
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

  private getWeb3Footer(strWeb3Name: string) {
    switch (strWeb3Name.toUpperCase()) {
      default:
      case 'METAMASK':
        return (
          <div className="MetaMask-footer">
            <div>
              {translate(`ADD_ACCOUNT_${this.state.web3ProviderSettings.name}_FOOTER`)}{' '}
              <NewTabLink
                content={translate(
                  `ADD_ACCOUNT_${this.state.web3ProviderSettings.name}_FOOTER_LINK`
                )}
                href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en"
              />
            </div>
            <div>
              <NewTabLink
                content={translate('ADD_ACCOUNT_METAMASK_HELP')}
                href={`${KB_URL}/how-to/migrating/moving-from-mycrypto-to-metamask`}
              />
            </div>
          </div>
        );
        break;
      case 'TRUST':
        break;
    }
  }

  private getWeb3Provider() {
    if (window.web3) {
      switch (true) {
        default:
        case window.web3.currentProvider.isMetaMask:
          return { name: 'METAMASK', icon: MetamaskSVG };
        case window.web3.currentProvider.isTrust:
          return { name: 'TRUST', icon: TrustWalletSVG };
      }
    }
    return { name: 'METAMASK', icon: MetamaskSVG }; //Default to MetaMask
  }
}

export default Web3ProviderDecrypt;
