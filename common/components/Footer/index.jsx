import React from 'react';
import translate, { getTranslators } from 'translations';
import { donationAddressMap } from 'config/data';
import logo from 'assets/images/logo-myetherwallet.svg';
import { bityReferralURL } from 'config/data';
import './index.scss';

const onTheWebLinks = [
  {
    ariaLabel: 'my ether wallet.com',
    href: 'https://www.MyEtherWallet.com',
    content: 'www.MyEtherWallet.com'
  },
  {
    ariaLabel: 'my ether wallet github',
    href: 'https://github.com/kvhnuke/etherwallet',
    content: 'Github: MyEtherWallet.com & CX'
  },
  {
    ariaLabel: 'our organization on github',
    href: 'https://github.com/MyEtherWallet',
    content: 'Github: MyEtherWallet (Org)'
  },
  {
    ariaLabel: 'join our slack',
    href: 'https://myetherwallet.herokuapp.com/',
    content: 'Join Our Slack'
  },
  {
    ariaLabel: 'twitter',
    href: 'https://twitter.com/myetherwallet',
    content: 'Twitter'
  },
  {
    ariaLabel: 'facebook',
    href: 'https://www.facebook.com/MyEtherWallet',
    content: 'Facebook'
  }
];

const affiliateLinks = [
  {
    ariaLabel: 'Swap Ether or Bitcoin via Bity.com',
    href: bityReferralURL,
    content: 'Swap ETH/BTC/EUR/CHF via Bity.com'
  },
  {
    ariaLabel: '',
    href: 'https://www.ledgerwallet.com/r/fa4b?path=/products',
    content: 'Buy a Ledger Nano S'
  },
  {
    ariaLabel: '',
    href: 'https://trezor.io/?a=myetherwallet.com',
    content: 'Buy a TREZOR'
  }
];

const Footer = () => {
  const translators = getTranslators();
  return (
    <footer className="Footer" role="contentinfo" aria-label="footer">
      <div className="container">
        <section className="row">
          <section className="row">
            <div className="Footer-about col-sm-3">
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
              <p>
                <span>{translate('FOOTER_1')}</span>
                <span>{translate('FOOTER_1b')}</span>
                <a
                  aria-label="kvhnuke's github"
                  href="https://github.com/kvhnuke"
                  target="_blank"
                >
                  kvhnuke
                </a>
                {' & '}
                <a
                  aria-label="tayvano's github"
                  href="https://github.com/tayvano"
                  target="_blank"
                >
                  tayvano
                </a>.
              </p>
              <br />
            </div>

            <div className="Footer-info col-sm-6">
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

              <h5>
                <i aria-hidden="true">👫</i>
                {translate('ADD_Warning_1')}
              </h5>
              <p>Consider using our affiliate links to...</p>
              <ul>
                {affiliateLinks.map(link =>
                  <li>
                    <a
                      aria-label={link.ariaLabel}
                      href={link.href}
                      target="_blank"
                    >
                      {link.content}
                    </a>
                  </li>
                )}
              </ul>

              {!!translators.length &&
                <h5>
                  {' '}<i>🏅</i> <span>{translate('Translator_Desc')}</span>
                </h5>}
              {!!translators.length &&
                <ul>
                  <li>
                    {translators.map(key =>
                      <span key={key}>
                        {translate(key)}
                      </span>
                    )}
                  </li>
                </ul>}
            </div>

            <div className="Footer-links col-sm-3">
              <h5>
                <i aria-hidden="true">🌎</i> On the Web
              </h5>
              <ul>
                {onTheWebLinks.map(link =>
                  <li>
                    <a
                      aria-label={link.ariaLabel}
                      href={link.href}
                      target="_blank"
                    >
                      {link.content}
                    </a>
                  </li>
                )}
              </ul>

              <h5>
                <i aria-hidden="true">🙏</i> Support
              </h5>
              <ul>
                <li>
                  <a
                    aria-label="email support at myetherwallet.com"
                    href="mailto:support@myetherwallet.com"
                    target="_blank"
                  >
                    Email
                  </a>
                </li>
                <li>
                  <a
                    aria-label="open a github issue"
                    href="https://github.com/kvhnuke/etherwallet/issues"
                    target="_blank"
                  >
                    Github Issue
                  </a>
                </li>
              </ul>
            </div>
          </section>
        </section>
      </div>
    </footer>
  );
};

export default Footer;
