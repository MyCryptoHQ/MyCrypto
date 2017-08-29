import React, { Component } from 'react';
import translate from 'translations';
import { donationAddressMap } from 'config/data';
import logo from 'assets/images/logo-myetherwallet.svg';
import { bityReferralURL } from 'config/data';
import './index.scss';

const LINKS_LEFT = [
  {
    text: 'Knowledge Base',
    href: 'https://myetherwallet.groovehq.com/help_center'
  },
  {
    text: 'Helpers & ENS Debugging',
    href: 'https://www.myetherwallet.com/helpers.html'
  },
  {
    text: 'Sign Message',
    href: 'https://www.myetherwallet.com/signmsg.html'
  }
];

const LINKS_SUPPORT = [
  {
    href: bityReferralURL,
    text: 'Swap ETH/BTC/EUR/CHF via Bity.com'
  },
  {
    href: 'https://www.ledgerwallet.com/r/fa4b?path=/products/',
    text: 'Buy a Ledger Nano S'
  },
  {
    href: 'https://trezor.io/?a=myetherwallet.com',
    text: 'Buy a TREZOR'
  },
  {
    href: 'https://digitalbitbox.com/?ref=mew',
    text: 'Buy a Digital Bitbox'
  }
];

const LINKS_RIGHT = [
  {
    href: 'https://www.MyEtherWallet.com',
    text: 'MyEtherWallet.com'
  },
  {
    href: 'https://github.com/MyEtherWallet/MyEtherWallet',
    text: 'Github: Current Site'
  },
  {
    href: 'https://github.com/MyEtherWallet',
    text: 'Github: MEW Org'
  },
  {
    href: 'https://github.com/MyEtherWallet/MyEtherWallet/releases/latest',
    text: 'Github: Latest Release'
  },
  {
    href:
      'https://chrome.google.com/webstore/detail/myetherwallet-cx/nlbmnnijcnlegkjjpcfjclmcfggfefdm?hl=en',
    text: 'MyEtherWallet CX'
  },
  {
    href:
      'https://chrome.google.com/webstore/detail/etheraddresslookup/pdknmigbbbhmllnmgdfalmedcmcefdfn',
    text: 'Anti-Phishing CX'
  }
];

const LINKS_SOCIAL = [
  {
    href: 'https://myetherwallet.herokuapp.com/',
    text: 'Slack'
  },
  {
    href: 'https://www.reddit.com/r/MyEtherWallet/',
    text: 'Reddit'
  },
  {
    href: 'https://twitter.com/myetherwallet',
    text: 'Twitter'
  },
  {
    href: 'https://www.facebook.com/MyEtherWallet/',
    text: 'Facebook'
  },
  {
    href: 'https://medium.com/@myetherwallet',
    text: 'Medium'
  }
];

export default class Footer extends Component {
  render() {
    return (
      <footer className="Footer" role="contentinfo" aria-label="footer">
        <div className="Footer-column Footer-about">
          <p aria-hidden="true">
            <a href="/">
              <img
                className="Footer-about-logo"
                src={logo}
                height="55px"
                width="auto"
                alt="MyEtherWallet"
              />
            </a>
          </p>
          <p className="Footer-about-text">
            <span>
              {translate('FOOTER_1')}
            </span>
            <span>
              {translate('FOOTER_1b')}
            </span>
          </p>

          {LINKS_LEFT.map(link => {
            return (
              <p key={link.href}>
                <a href={link.href} target="_blank" rel="noopener">
                  {link.text}
                </a>
              </p>
            );
          })}

          <p>&copy; 2017 MyEtherWallet, LLC</p>
        </div>

        <div className="Footer-column Footer-info">
          <h5>
            <i aria-hidden="true">👫</i>
            You can support us by supporting our blockchain-family.
          </h5>
          <p>Consider using our affiliate links to...</p>
          <ul>
            {LINKS_SUPPORT.map(link => {
              return (
                <li key={link.href}>
                  <a href={link.href} target="_blank">
                    {link.text}
                  </a>
                </li>
              );
            })}
          </ul>

          <h5>
            <i aria-hidden="true">💝</i>
            {translate('FOOTER_2')}
          </h5>
          <ul>
            <li>
              {' '}ETH:{' '}
              <span className="mono wrap">{donationAddressMap.ETH}</span>
            </li>
            <li>
              {' '}BTC:{' '}
              <span className="mono wrap">{donationAddressMap.BTC}</span>
            </li>
          </ul>
        </div>

        <div className="Footer-column Footer-links">
          {LINKS_RIGHT.map(link => {
            return (
              <p key={link.href}>
                <a href={link.href} target="_blank">
                  {link.text}
                </a>
              </p>
            );
          })}
          <p>
            {LINKS_SOCIAL.map((link, i) => {
              return (
                <span key={link.href}>
                  <a key={link.href} href={link.href} target="_blank">
                    {link.text}
                  </a>
                  {i !== LINKS_SOCIAL.length - 1 && ' · '}
                </span>
              );
            })}
          </p>

          {/* TODO: Fix me */}
          <p>Latest Block#: ?????</p>
        </div>
      </footer>
    );
  }
}
