import logo from 'assets/images/logo-mycrypto.svg';
import {
  ledgerReferralURL,
  trezorReferralURL,
  ethercardReferralURL,
  donationAddressMap,
  VERSION,
  knowledgeBaseURL,
  discordURL
} from 'config';
import React from 'react';
import PreFooter from './PreFooter';
import DisclaimerModal from './DisclaimerModal';
import { NewTabLink } from 'components/ui';
import OnboardModal from 'containers/OnboardModal';
import './index.scss';
import { translateRaw } from 'translations';

const SocialMediaLink = ({ link, text }: Link) => {
  return (
    <NewTabLink className="SocialMediaLink" key={link} href={link} aria-label={text}>
      <i className={`sm-icon sm-logo-${text}`} />
    </NewTabLink>
  );
};

const SOCIAL_MEDIA: Link[] = [
  {
    link: 'https://twitter.com/mycrypto',
    text: 'twitter'
  },
  {
    link: 'https://www.facebook.com/MyCrypto/',
    text: 'facebook'
  },
  {
    link: 'https://medium.com/@mycrypto',
    text: 'medium'
  },
  {
    link: 'https://www.linkedin.com/company/mycrypto',
    text: 'linkedin'
  },
  {
    link: 'https://github.com/MyCryptoHQ',
    text: 'github'
  },
  {
    link: 'https://www.reddit.com/r/mycrypto/',
    text: 'reddit'
  },
  {
    link: discordURL,
    text: 'discord'
  }
];

const PRODUCT_INFO: Link[] = [
  {
    link:
      'https://chrome.google.com/webstore/detail/etheraddresslookup/pdknmigbbbhmllnmgdfalmedcmcefdfn',
    text: translateRaw('ETHER_ADDRESS_LOOKUP')
  },
  {
    link:
      'https://chrome.google.com/webstore/detail/ethersecuritylookup/bhhfhgpgmifehjdghlbbijjaimhmcgnf',
    text: translateRaw('ETHER_SECURITY_LOOKUP')
  },
  {
    link: 'https://etherscamdb.info/',
    text: translateRaw('ETHERSCAMDB')
  },
  {
    link: 'https://www.mycrypto.com/helpers.html',
    text: translateRaw('FOOTER_HELP_AND_DEBUGGING')
  },
  {
    link: 'mailto:press@mycrypto.com',
    text: translateRaw('FOOTER_PRESS')
  }
];

const AFFILIATES: Link[] = [
  {
    link: ledgerReferralURL,
    text: translateRaw('LEDGER_REFERRAL_1')
  },
  {
    link: trezorReferralURL,
    text: translateRaw('TREZOR_REFERAL')
  },
  {
    link: ethercardReferralURL,
    text: translateRaw('ETHERCARD_REFERAL')
  }
];

const FRIENDS: Link[] = [
  {
    link: 'https://metamask.io/',
    text: 'MetaMask'
  },
  {
    link: 'https://infura.io/',
    text: 'Infura'
  },
  {
    link: 'https://etherscan.io/',
    text: 'Etherscan'
  },
  {
    link: 'https://etherchain.org/',
    text: 'Etherchain'
  }
];

interface Link {
  link: string;
  text: string;
}

interface Props {
  latestBlock: string;
}

interface State {
  isDisclaimerOpen: boolean;
}

export default class Footer extends React.PureComponent<Props, State> {
  public state: State = {
    isDisclaimerOpen: false
  };

  public render() {
    return (
      <div>
        <PreFooter openModal={this.toggleModal} />
        <footer className="Footer" role="contentinfo" aria-label="footer">
          <div className="Footer-links Footer-section">
            <div className="Footer-links-social">
              {SOCIAL_MEDIA.map((socialMediaItem, idx) => (
                <SocialMediaLink
                  link={socialMediaItem.link}
                  key={idx}
                  text={socialMediaItem.text}
                />
              ))}
            </div>

            <div className="Footer-links-links">
              {PRODUCT_INFO.map((productInfoItem, idx) => (
                <NewTabLink key={idx} href={productInfoItem.link}>
                  {productInfoItem.text}
                </NewTabLink>
              ))}
            </div>
          </div>

          <div className="Footer-about Footer-section">
            <NewTabLink className="Footer-about-logo" href="/">
              <img
                className="Footer-about-logo-img"
                src={logo}
                height="55px"
                width="auto"
                alt="MyCrypto logo"
              />
            </NewTabLink>

            <div className="Footer-about-links">
              <NewTabLink href="https://mycrypto.com">MyCrypto.com</NewTabLink>
              <NewTabLink href={knowledgeBaseURL}>{translateRaw('FOOTER_SUPPORT')}</NewTabLink>
              <NewTabLink href="https://about.mycrypto.com">
                {translateRaw('FOOTER_TEAM')}
              </NewTabLink>
            </div>

            <p className="Footer-about-text">{translateRaw('FOOTER_ABOUT')}</p>

            <div className="Footer-about-legal">
              <div className="Footer-about-legal-text">
                © {new Date().getFullYear()} MyCrypto, Inc.
              </div>
              <div className="Footer-about-legal-text">
                <a onClick={this.toggleModal}>{translateRaw('DISCLAIMER')}</a>
              </div>
              <div className="Footer-about-legal-text">v{VERSION}</div>
            </div>
          </div>

          <div className="Footer-support Footer-section">
            <h5 className="Footer-support-title">{translateRaw('FOOTER_AFFILIATE_TITLE')}</h5>
            <div className="Footer-support-affiliates">
              {AFFILIATES.map((link, i) => (
                <NewTabLink key={i} href={link.link}>
                  {link.text}
                </NewTabLink>
              ))}
            </div>

            <div className="Footer-support-donate">
              <div className="Footer-support-donate-currency">
                {translateRaw('DONATE_CURRENCY', { $currency: 'ETH' })}
              </div>
              <div className="Footer-support-donate-address">{donationAddressMap.ETH}</div>
            </div>

            <div className="Footer-support-donate">
              <div className="Footer-support-donate-currency">
                {translateRaw('DONATE_CURRENCY', { $currency: 'BTC' })}
              </div>
              <div className="Footer-support-donate-address">{donationAddressMap.BTC}</div>
            </div>

            <div className="Footer-support-friends">
              {FRIENDS.map((link, i) => (
                <NewTabLink key={i} href={link.link}>
                  {link.text}
                </NewTabLink>
              ))}
            </div>
          </div>
        </footer>

        <OnboardModal />
        <DisclaimerModal isOpen={this.state.isDisclaimerOpen} handleClose={this.toggleModal} />
      </div>
    );
  }

  private toggleModal = () => {
    this.setState(state => {
      this.setState({ isDisclaimerOpen: !state.isDisclaimerOpen });
    });
  };
}
