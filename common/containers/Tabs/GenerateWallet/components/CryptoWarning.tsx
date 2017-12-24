import * as React from 'react';
import NewTabLink from 'components/ui/NewTabLink';
import isMobile from 'utils/isMobile';

import firefoxIcon from 'assets/images/browsers/firefox.svg';
import chromeIcon from 'assets/images/browsers/chrome.svg';
import operaIcon from 'assets/images/browsers/opera.svg';
import './CryptoWarning.scss';

const BROWSERS = [
  {
    name: 'Firefox',
    href: 'https://www.mozilla.org/en-US/firefox/new/',
    icon: firefoxIcon
  },
  {
    name: 'Chrome',
    href: 'https://www.google.com/chrome/browser/desktop/index.html',
    icon: chromeIcon
  },
  {
    name: 'Opera',
    href: 'http://www.opera.com/',
    icon: operaIcon
  }
];

const CryptoWarning: React.SFC<{}> = () => (
  <div className="Tab-content-pane">
    <div className="CryptoWarning">
      <h2 className="CryptoWarning-title">Your Browser Cannot Generate a Wallet</h2>
      <p className="CryptoWarning-text">
        {isMobile
          ? `
          MyEtherWallet requires certain features for secure wallet generation
          that your browser doesn't offer. You can still securely use the site
          otherwise. To generate a wallet, please use your device's default
          browser, or switch to a laptop or desktop computer.
        `
          : `
          MyEtherWallet requires certain features for secure wallet generation
          that your browser doesn't offer. You can still securely use the site
          otherwise. To generate a wallet, upgrade to one of the following
          browsers:
        `}
      </p>

      <div className="CryptoWarning-browsers">
        {BROWSERS.map(browser => (
          <NewTabLink
            key={browser.href}
            href={browser.href}
            className="CryptoWarning-browsers-browser"
          >
            <div>
              <img className="CryptoWarning-browsers-browser-icon" src={browser.icon} />
              <div className="CryptoWarning-browsers-browser-name">{browser.name}</div>
            </div>
          </NewTabLink>
        ))}
      </div>
    </div>
  </div>
);

export default CryptoWarning;
