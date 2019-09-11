import React, { Component } from 'react';

import translate, { translateRaw } from 'translations';
import { KNOWLEDGE_BASE_URL as KB_URL } from 'v2/config';
import MetamaskSVG from 'common/assets/images/wallets/metamask-2.svg';
import { NewTabLink } from 'components/ui';
import { unlockWeb3 } from 'v2/services/WalletService';
import './Web3Provider.scss';
import { InlineErrorMsg } from 'v2/components';

interface Props {
  wallet: object;
  onUnlock(param: any): void;
}

interface State {
  web3Unlocked: boolean | undefined;
}

class Web3ProviderDecrypt extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      web3Unlocked: undefined
    };
    this.unlockWallet = this.unlockWallet.bind(this);
  }

  public render() {
    const { web3Unlocked } = this.state;
    return (
      <div className="Panel">
        <div className="Panel-title">{translate('ADD_ACCOUNT_METAMASK_TITLE')}</div>
        <div className="Panel-description">{translate('ADD_ACCOUNT_METAMASK_DESC')}</div>
        <div className="Panel-content">
          <div className="MetaMask-img-container">
            <div className="MetaMask-img">
              <img src={MetamaskSVG} />
            </div>
          </div>
          <button className="btn btn-primary btn-lg btn-block" onClick={this.unlockWallet}>
            {translate('ADD_METAMASK')}
          </button>

          {web3Unlocked === false && (
            <InlineErrorMsg>{translateRaw('WEB3_ONUNLOCK_NOT_FOUND_ERROR')}</InlineErrorMsg>
          )}
        </div>
        <div className="MetaMask-footer">
          <div>
            {translate('ADD_ACCOUNT_METAMASK_FOOTER')}{' '}
            <NewTabLink
              content={translate('ADD_ACCOUNT_METAMASK_FOOTER_LINK')}
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
      </div>
    );
  }

  public async unlockWallet() {
    try {
      const walletPayload = await unlockWeb3();
      if (!walletPayload) {
        throw new Error('Failed to unlock web3');
      }
      this.props.onUnlock(walletPayload);
    } catch (e) {
      this.setState({ ...this.state, web3Unlocked: false });
    }
  }
}

export default Web3ProviderDecrypt;
