import React from 'react';
import translate from 'translations';
import { NewTabLink } from 'components/ui';
import './Web3.scss';

interface Props {
  onUnlock(): void;
}

export const Web3Decrypt: React.SFC<Props> = ({ onUnlock }) => (
  <div className="Web3Decrypt">
    <div>
      <button className="Web3Decrypt-decrypt btn btn-primary btn-lg btn-block" onClick={onUnlock}>
        {translate('ADD_MetaMask')}
      </button>
    </div>

    <div>
      <NewTabLink
        className="Web3Decrypt-install btn btn-sm btn-default btn-block"
        content={translate('Download MetaMask')}
        href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en"
      />
    </div>
  </div>
);
