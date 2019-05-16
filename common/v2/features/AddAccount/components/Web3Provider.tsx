import React, { Component } from 'react';

import translate from 'translations';
import { knowledgeBaseURL as KB_URL } from 'v2/config';
import MetamaskSVG from 'common/assets/images/wallets/metamask-2.svg';
import { NewTabLink } from 'components/ui';
import { unlockWeb3 } from 'v2/features/Wallets';
import './Web3Provider.scss';

interface Props {
  wallet: object;
  onUnlock(param: any): void;
}

interface State {
  web3Unlocked: boolean;
}

class Web3ProviderDecrypt extends Component<Props> {
  public state: State = {
    web3Unlocked: false
  };
  private unlockWallet(onUnlock: Props) {
    async () => {
      const walletPayload = await unlockWeb3();
      onUnlock(walletPayload);
    };
  }

  componentWillMount() {
    let web3 = '';

    window.addEventListener('load', function() {
      // Checking if Web3 has been injected by the browser (Mist/MetaMask)
      if (typeof web3 !== 'undefined') {
        return (web3 = 'unlocked');
      } else {
        return (web3 = 'locked');
      }
    });

    if (web3 === 'unlocked') {
      this.setState({ web3Unlocked: true });
    } else {
      this.setState({ web3Unlocked: false });
    }
  }

  public render() {
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
}

export default Web3ProviderDecrypt;
