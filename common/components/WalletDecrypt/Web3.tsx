import React, { Component } from 'react';
import translate from 'translations';
import { NewTabLink } from 'components/ui';
import './Web3.scss';

interface Props {
  onUnlock(): void;
}

export default class Web3Decrypt extends Component<Props> {
  public render() {
    return (
      <section className="Web3Decrypt col-md-4 col-sm-6">
        <div>
          <button
            className="Web3Decrypt btn btn-primary btn-lg"
            onClick={this.props.onUnlock}
          >
            {translate('ADD_MetaMask')}
          </button>
        </div>

        <div>
          <NewTabLink
            className="Web3Decrypt-install btn btn-sm btn-default"
            content={translate('Download MetaMask')}
            href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en"
          />
        </div>
      </section>
    );
  }
}
