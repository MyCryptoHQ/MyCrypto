import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { Typography } from '@mycrypto/ui';
import translate from 'translations';
import TrustWalletWEBP from 'common/assets/images/wallets/trust-3.webp';
import CoinbaseWalletJPG from 'common/assets/images/wallets/coinbase.jpg';
import MetamaskSVG from 'common/assets/images/wallets/metamask-2.svg';
import AppStoreBadgeIMG from 'assets/images/mobile/app-store-badge.png';
import GooglePlayBadgeIMG from 'assets/images/mobile/google-play-badge.png';
import { NewTabLink, HelpLink } from 'components/ui';
import { IS_MOBILE } from '../flags';

interface Props {
  wallet: object;
  onUnlock(): void;
}

function InstallTrunk({ wallet, onUnlock }: Props) {
  return (
    <div className="Panel">
      <div className="Panel-title">{translate('ADD_ACCOUNT_WEB3_INSTALL_TITLE')}</div>
      <div className="Panel-description">{translate('ADD_ACCOUNT_WEB3_INSTALL_MOBILE_DESC')}</div>
      <div className="Panel-content">
        <div className="download-option">
          <NewTabLink
            href="https://trustwallet.com/dapp">
            <img src={TrustWalletWEBP} />
          </NewTabLink>
          <Typography>TrustWallet App</Typography>
          <NewTabLink
            href="https://itunes.apple.com/us/app/trust-ethereum-wallet/id1288339409">
            <img src={AppStoreBadgeIMG} />
          </NewTabLink>
          <NewTabLink
            href="https://play.google.com/store/apps/details?id=com.wallet.crypto.trustapp">
            <img src={GooglePlayBadgeIMG} />
          </NewTabLink>
        </div>
        <div className="download-option">
          <NewTabLink
            href="https://www.coinbase.com/mobile" target="_black" >
            <img src={CoinbaseWalletJPG} />
          </NewTabLink>
          <Typography>Coinbase App</Typography>
          <NewTabLink
            href="https://itunes.apple.com/us/app/coinbase-bitcoin-wallet/id886427730?mt=8">
            <img src={AppStoreBadgeIMG} />
          </NewTabLink>
          <NewTabLink
            href="https://play.google.com/store/apps/details?id=com.coinbase.android">
            <img src={GooglePlayBadgeIMG} />
          </NewTabLink>
        </div>
      </div>
    </div>
  );
}

function InstallMetaMask({ wallet, onUnlock }: Props) {
  return (
    <div className="Panel">
      <div className="Panel-title">{translate('ADD_ACCOUNT_WEB3_INSTALL_TITLE')}</div>
      <div className="Panel-description">{translate('ADD_ACCOUNT_WEB3_INSTALL_DESC')}</div>
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
          {translate('ADD_ACCOUNT_WEB3_INSTALL_FOOTER')}{' '}
          <NewTabLink
            content={translate('ADD_ACCOUNT_WEB3_INSTALL_FOOTER_LINK')}
            href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en"
          />
        </div>
      </div>
    </div>
  );
}

function Web3ProviderInstall(props: Props) {
  return <>{IS_MOBILE ? <InstallTrunk {...props} /> : <InstallMetaMask {...props} />}</>;
}

export default Web3ProviderInstall;
