import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { Typography } from '@mycrypto/ui';
import translate from 'translations';
import MetamaskSVG from 'common/assets/images/wallets/metamask-2.svg';
import { NewTabLink, HelpLink } from 'components/ui';

interface Props {
  wallet: object;
  onUnlock(): void;
}

function Web3ProviderDecrypt({ wallet, onUnlock }: Props) {
  return (
    <div className="Panel">
      <div className="Panel-title">{translate('ADD_ACCOUNT_METAMASK_TITLE')}</div>
      <div className="Panel-description">{translate('ADD_ACCOUNT_METAMASK_DESC')}</div>
      <div className="Panel-content">
        <div>
          <div className="Panel-content-img">
            <img src={MetamaskSVG} />
          </div>
          <button className="btn btn-primary btn-lg btn-block" onClick={onUnlock}>
            {translate('ADD_METAMASK')}
          </button>
        </div>
      </div>
      <div className="Panel-footer">
        <div>
          {translate('ADD_ACCOUNT_METAMASK_FOOTER')}{' '}
          <NewTabLink
            content={translate('ADD_ACCOUNT_METAMASK_FOOTER_LINK')}
            href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en"
          />
        </div>
        <div>
          <NewTabLink content={translate('ADD_ACCOUNT_METAMASK_HELP')} href={wallet.helpLink} />
        </div>
      </div>
    </div>
  );
}

export default Web3ProviderDecrypt;
