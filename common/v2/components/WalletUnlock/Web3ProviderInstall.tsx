import React from 'react';
import { Typography } from '@mycrypto/ui';

import translate, { translateRaw } from 'v2/translations';
import { DOWNLOAD_MYCRYPTO_LINK } from 'v2/config';

import TrustWalletWEBP from 'common/assets/images/wallets/trust-3.webp';
import CoinbaseWalletJPG from 'common/assets/images/wallets/coinbase.jpg';
import MetamaskSVG from 'common/assets/images/wallets/metamask.svg';
import AppStoreBadgeIMG from 'assets/images/mobile/app-store-badge.png';
import GooglePlayBadgeIMG from 'assets/images/mobile/google-play-badge.png';
import { NewTabLink } from 'v2/components';
import { IS_MOBILE } from 'v2/utils';
import './Web3ProviderInstall.scss';

function InstallTrunk() {
  return (
    <div className="Panel">
      <div className="Panel-title">
        {translate('ADD_ACCOUNT_WEB3_INSTALL_TITLE', { $walletId: 'Web3 Provider' })}
      </div>
      <div className="Panel-description">{translate('ADD_ACCOUNT_WEB3_INSTALL_MOBILE_DESC')}</div>
      <div className="Panel-content">
        <div className="Web3-options">
          <div className="TrustWallet-container">
            <NewTabLink href="https://trustwallet.com/dapp">
              <div className="TrustWallet-img">
                <img src={TrustWalletWEBP} />
              </div>
            </NewTabLink>

            <Typography>{translateRaw('TRUST_APP_LABEL')}</Typography>
            <NewTabLink
              className="download-option"
              href="https://itunes.apple.com/us/app/trust-ethereum-wallet/id1288339409"
            >
              <img src={AppStoreBadgeIMG} />
            </NewTabLink>
            <NewTabLink
              className="download-option"
              href="https://play.google.com/store/apps/details?id=com.wallet.crypto.trustapp"
            >
              <img src={GooglePlayBadgeIMG} />
            </NewTabLink>
          </div>

          <div className="CoinbaseWallet-container">
            <NewTabLink href="https://www.coinbase.com/mobile" target="_blank">
              <div className="CoinbaseWallet-img">
                <img src={CoinbaseWalletJPG} />
              </div>
            </NewTabLink>
            <Typography>{translateRaw('COINBASE_APP_LABEL')}</Typography>
            <NewTabLink
              className="download-option"
              href="https://itunes.apple.com/us/app/coinbase-bitcoin-wallet/id886427730?mt=8"
            >
              <img src={AppStoreBadgeIMG} />
            </NewTabLink>
            <NewTabLink
              className="download-option"
              href="https://play.google.com/store/apps/details?id=com.coinbase.android"
            >
              <img src={GooglePlayBadgeIMG} />
            </NewTabLink>
          </div>
        </div>
      </div>
    </div>
  );
}

function InstallMetaMask() {
  return (
    <div className="Panel">
      <div className="Panel-title">
        {translate('ADD_ACCOUNT_WEB3_INSTALL_TITLE', { $walletId: 'Metamask' })}
      </div>
      <div className="Panel-description">{translate('ADD_ACCOUNT_WEB3_INSTALL_DESC')}</div>
      <div className="Panel-content">
        <div>
          <div className="Panel-content-img">
            <img src={MetamaskSVG} />
          </div>
          <a href="https://metamask.io/" target="_blank" rel="noreferrer">
            <button className="btn btn-primary btn-lg btn-block">
              {translate('METAMASK_DOWNLOAD')}
            </button>
          </a>
        </div>
      </div>
      <div className="MetaMaskPanel-footer">
        {translate('ADD_ACCOUNT_WEB3_INSTALL_FOOTER')} <br />
        <NewTabLink
          content={translate('ADD_ACCOUNT_WEB3_INSTALL_FOOTER_LINK')}
          href={DOWNLOAD_MYCRYPTO_LINK}
        />
      </div>
    </div>
  );
}

function Web3ProviderInstall() {
  return <>{IS_MOBILE ? <InstallTrunk /> : <InstallMetaMask />}</>;
}

export default Web3ProviderInstall;
