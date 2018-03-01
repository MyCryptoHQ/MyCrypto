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
    text: 'Ether Address Lookup'
  },
  {
    link:
      'https://chrome.google.com/webstore/detail/ethersecuritylookup/bhhfhgpgmifehjdghlbbijjaimhmcgnf',
    text: 'Ether Security Lookup'
  },
  {
    link: 'https://etherscamdb.info/',
    text: 'EtherScamDB'
  },
  {
    link: 'https://www.mycrypto.com/helpers.html',
    text: 'Helpers & ENS Debugging'
  },
  {
    link: 'mailto:press@mycrypto.com',
    text: 'Press Inquiries'
  }
];

const AFFILIATES: Link[] = [
  {
    link: ledgerReferralURL,
    text: 'Buy a Ledger Wallet'
  },
  {
    link: trezorReferralURL,
    text: 'Buy a TREZOR'
  },
  {
    link: ethercardReferralURL,
    text: 'Get an ether.card'
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
              <a href="https://mycrypto.com">MyCrypto.com</a>
              <NewTabLink href={knowledgeBaseURL}>Help & Support</NewTabLink>
              <NewTabLink href="https://about.mycrypto.com">Our Team</NewTabLink>
            </div>

            <p className="Footer-about-text">
              MyCrypto is an open-source, client-side tool for generating Ether Wallets, handling
              ERC-20 tokens, and interacting with the blockchain more easily. Developed by and for
              the community since 2015, we’re focused on building awesome products that put the
              power in people’s hands.
            </p>

            <div className="Footer-about-legal">
              <div className="Footer-about-legal-text">
                © {new Date().getFullYear()} MyCrypto, Inc.
              </div>
              <div className="Footer-about-legal-text">
                <a onClick={this.toggleModal}>Disclaimer</a>
              </div>
              <div className="Footer-about-legal-text">v{VERSION}</div>
            </div>
          </div>

          <div className="Footer-support Footer-section">
            <h5 className="Footer-support-title">Support Us & Our Friends</h5>
            <div className="Footer-support-affiliates">
              {AFFILIATES.map(link => (
                <NewTabLink key={link.text} href={link.link}>
                  {link.text}
                </NewTabLink>
              ))}
            </div>

            <div className="Footer-support-donate">
              <div className="Footer-support-donate-currency">Donate ETH</div>
              <div className="Footer-support-donate-address">{donationAddressMap.ETH}</div>
            </div>

            <div className="Footer-support-donate">
              <div className="Footer-support-donate-currency">Donate BTC</div>
              <div className="Footer-support-donate-address">{donationAddressMap.BTC}</div>
            </div>

            <div className="Footer-support-friends">
              {FRIENDS.map(link => (
                <NewTabLink key={link.text} href={link.link}>
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
