import React, { useEffect } from 'react';
import { Typography } from '@mycrypto/ui';

import { DOWNLOAD_MYCRYPTO_LINK, WALLETS_CONFIG } from 'v2/config';
import translate from 'v2/translations';
import { ANALYTICS_CATEGORIES, AnalyticsService } from 'v2/services';

import AppStoreBadgeIMG from 'assets/images/mobile/app-store-badge.png';
import GooglePlayBadgeIMG from 'assets/images/mobile/google-play-badge.png';
import { NewTabLink } from 'v2/components';
import { useScreenSize } from 'v2/utils';
import './Web3ProviderInstall.scss';

function InstallTrunk() {
  const providers = [WALLETS_CONFIG.TRUST, WALLETS_CONFIG.COINBASE];
  return (
    <div className="Web3-options">
      {providers.map((provider) => (
        <div key={provider.id} className="Provider-container">
          <NewTabLink href={provider.install ? provider.install.getItLink : undefined}>
            <div className="Provider-img">
              <img src={provider.icon} />
            </div>
          </NewTabLink>

          <Typography>{provider.name}</Typography>
          {provider.install && provider.install.appStore && (
            <NewTabLink className="download-option" href={provider.install.appStore}>
              <img src={AppStoreBadgeIMG} />
            </NewTabLink>
          )}

          {provider.install && provider.install.googlePlay && (
            <NewTabLink className="download-option" href={provider.install.googlePlay}>
              <img src={GooglePlayBadgeIMG} />
            </NewTabLink>
          )}
        </div>
      ))}
    </div>
  );
}

function InstallMetaMask() {
  const provider = WALLETS_CONFIG.METAMASK;
  return (
    <>
      <div>
        <div className="Panel-content-img">
          <div className="Provider-img">
            <img src={provider.icon} />
          </div>
        </div>
        <a
          href={provider.install ? provider.install.getItLink : undefined}
          target="_blank"
          rel="noreferrer"
        >
          <button className="btn btn-primary btn-lg btn-block">
            {translate('PROVIDER_DOWNLOAD', { $provider: provider.name })}
          </button>
        </a>
      </div>
      <div className="Provider-footer">
        {translate('ADD_ACCOUNT_WEB3_INSTALL_FOOTER')} <br />
        <NewTabLink
          content={translate('ADD_ACCOUNT_WEB3_INSTALL_FOOTER_LINK')}
          href={DOWNLOAD_MYCRYPTO_LINK}
        />
      </div>
    </>
  );
}

function Web3ProviderInstall() {
  useEffect(() => {
    AnalyticsService.instance.track(ANALYTICS_CATEGORIES.ADD_WEB3_ACCOUNT, `No provider detected`);
  }, []);
  const { isMobile } = useScreenSize();
  return (
    <div className="Panel">
      <div className="Panel-title">
        {translate('ADD_ACCOUNT_WEB3_INSTALL_TITLE', {
          $walletId: isMobile ? 'Web3 Provider' : 'Metamask'
        })}
      </div>
      <div className="Panel-description">
        {translate(
          isMobile ? 'ADD_ACCOUNT_WEB3_INSTALL_MOBILE_DESC' : 'ADD_ACCOUNT_WEB3_INSTALL_DESC'
        )}
      </div>
      <div className="Panel-content">{isMobile ? <InstallTrunk /> : <InstallMetaMask />}</div>
    </div>
  );
}

export default Web3ProviderInstall;
