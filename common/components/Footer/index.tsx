import logo from 'assets/images/logo-myetherwallet.svg';
import { bityReferralURL, donationAddressMap } from 'config/data';
import React, { Component } from 'react';
import translate from 'translations';
import './index.scss';
import PreFooter from './PreFooter';
import Modal, { IButton } from 'components/ui/Modal';

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

interface ComponentState {
  isOpen: boolean;
}

export default class Footer extends React.Component<{}, ComponentState> {
  constructor(props) {
    super(props);
    this.state = { isOpen: false };
  }

  public openModal = () => {
    this.setState({ isOpen: true });
  };

  public closeModal = () => {
    this.setState({ isOpen: false });
  };

  public render() {
    const buttons: IButton[] = [
      { text: 'Okay', type: 'default', onClick: this.closeModal }
    ];
    return (
      <div>
        <PreFooter />
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
              <span>{translate('FOOTER_1')}</span>
              <span>{translate('FOOTER_1b')}</span>
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

            <button className="Footer-modal-button" onClick={this.openModal}>
              Disclaimer
            </button>
            <Modal
              isOpen={this.state.isOpen}
              title="Disclaimer"
              buttons={buttons}
              handleClose={this.closeModal}
            >
              <p>
                <b>Be safe & secure: </b>
                <a href="https://myetherwallet.groovehq.com/knowledge_base/topics/protecting-yourself-and-your-funds">
                  We highly recommend that you read our guide on How to Prevent
                  Loss & Theft for some recommendations on how to be proactive
                  about your security.
                </a>
              </p>
              <p>
                <b>Always backup your keys: </b>
                MyEtherWallet.com & MyEtherWallet CX are not "web wallets". You
                do not create an account or give us your funds to hold onto. No
                data leaves your computer / your browser. We make it easy for
                you to create, save, and access your information and interact
                with the blockchain.
              </p>
              <p>
                <b>We are not responsible for any loss: </b>
                Ethereum, MyEtherWallet.com & MyEtherWallet CX, and some of the
                underlying Javascript libraries we use are under active
                development. While we have thoroughly tested & tens of thousands
                of wallets have been successfully created by people all over the
                globe, there is always the possibility something unexpected
                happens that causes your funds to be lost. Please do not invest
                more than you are willing to lose, and please be careful.
              </p>
              <p>
                <b>Translations of MyEtherWallet: </b>
                The community has done an amazing job translating MyEtherWallet
                into a variety of languages. However, MyEtherWallet can only
                verify the validity and accuracy of the information provided in
                English and, because of this, the English version of our website
                is the official text.
              </p>
              <p>
                <b>MIT License</b> Copyright © 2015-2017 MyEtherWallet LLC
              </p>
              <p>
                Permission is hereby granted, free of charge, to any person
                obtaining a copy of this software and associated documentation
                files (the "Software"), to deal in the Software without
                restriction, including without limitation the rights to use,
                copy, modify, merge, publish, distribute, sublicense, and/or
                sell copies of the Software, and to permit persons to whom the
                Software is furnished to do so, subject to the following
                conditions:
              </p>
              <p>
                The above copyright notice and this permission notice shall be
                included in all copies or substantial portions of the Software.
              </p>
              <b>
                THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
                EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
                OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
                NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
                HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
                WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
                FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
                OTHER DEALINGS IN THE SOFTWARE.
              </b>
            </Modal>

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
                {' '}
                ETH: <span className="mono wrap">{donationAddressMap.ETH}</span>
              </li>
              <li>
                {' '}
                BTC: <span className="mono wrap">{donationAddressMap.BTC}</span>
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
      </div>
    );
  }
}
