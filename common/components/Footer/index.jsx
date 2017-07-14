import React, { Component } from 'react';
import translate, { getTranslators } from 'translations';
import { donationAddressMap } from 'config/data';
import logo from 'assets/images/logo-myetherwallet.svg';

export default class Footer extends Component {
  render() {
    const translators = getTranslators();
    return (
      <footer role="contentinfo" aria-label="footer">
        <div className="container">
          <section className="row">
            <section className="row">
              <div className="col-sm-3 footer-1">
                <p aria-hidden="true">
                  <a href="/">
                    <img
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
              <div className="col-sm-6 footer-2">
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
                  <li>
                    <a
                      aria-label="Swap Ether or Bitcoin via Bity.com"
                      href="https://bity.com/af/jshkb37v"
                      target="_blank"
                    >
                      Swap ETH/BTC/EUR/CHF via Bity.com
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.ledgerwallet.com/r/fa4b?path=/products/"
                      target="_blank"
                    >
                      Buy a Ledger Nano S
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://trezor.io/?a=myetherwallet.com"
                      target="_blank"
                    >
                      Buy a TREZOR
                    </a>
                  </li>
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
              <div className="col-sm-3 footer-3">
                <h5>
                  <i aria-hidden="true">🌎</i> On the Web
                </h5>
                <ul>
                  <li>
                    <a
                      aria-label="my ether wallet.com"
                      href="https://www.MyEtherWallet.com"
                      target="_blank"
                    >
                      www.MyEtherWallet.com
                    </a>
                  </li>
                  <li>
                    <a
                      aria-label="my ether wallet github"
                      href="https://github.com/kvhnuke/etherwallet"
                      target="_blank"
                    >
                      Github: MyEtherWallet.com & CX
                    </a>
                  </li>
                  <li>
                    <a
                      aria-label="our organization on github"
                      href="https://github.com/MyEtherWallet"
                      target="_blank"
                    >
                      Github: MyEtherWallet (Org)
                    </a>
                  </li>
                  <li>
                    <a
                      aria-label="join our slack"
                      href="https://myetherwallet.herokuapp.com/"
                      target="_blank"
                    >
                      Join Our Slack
                    </a>
                  </li>
                  <li>
                    <a
                      aria-label="twitter"
                      href="https://twitter.com/myetherwallet"
                      target="_blank"
                    >
                      Twitter
                    </a>
                  </li>
                  <li>
                    <a
                      aria-label="facebook"
                      href="https://www.facebook.com/MyEtherWallet/"
                      target="_blank"
                    >
                      Facebook
                    </a>
                  </li>
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
  }
}
