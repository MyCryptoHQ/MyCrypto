import logo from 'assets/images/logo-mycrypto.svg';
import {
  ledgerReferralURL,
  trezorReferralURL,
  bitboxReferralURL,
  donationAddressMap,
  VERSION,
  knowledgeBaseURL
} from 'config';
import React from 'react';
import translate from 'translations';
import './index.scss';
import PreFooter from './PreFooter';
import Disclaimer from './Disclaimer';
import { NewTabLink } from 'components/ui';
import OnboardModal from 'containers/OnboardModal';

const AffiliateTag = ({ link, text }: Link) => {
  return (
    <li className="Footer-affiliate-tag" key={link}>
      <NewTabLink href={link}>{text}</NewTabLink>
    </li>
  );
};

const SocialMediaLink = ({ link, text }: Link) => {
  return (
    <NewTabLink className="Footer-social-media-link" key={link} href={link}>
      <i className={`sm-icon sm-logo-${text} sm-24px`} />
    </NewTabLink>
  );
};

const SOCIAL_MEDIA: Link[] = [
  {
    link: 'https://www.reddit.com/r/mycrypto/',
    text: 'reddit'
  },

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
  }
];

const PRODUCT_INFO: Link[] = [
  {
    link: knowledgeBaseURL,
    text: 'Knowledge Base'
  },
  {
    link: 'https://www.mycrypto.com/helpers.html',
    text: 'Helpers & ENS Debugging'
  },

  {
    link: 'https://github.com/MyCryptoHQ/MyCrypto',
    text: 'Github: Current Site'
  },
  {
    link: 'https://github.com/MyCryptoHQ',
    text: 'Github: MyCrypto Org'
  },
  {
    link: 'https://github.com/MyCryptoHQ/MyCrypto/releases/latest',
    text: 'Github: Latest Release'
  },

  {
    link:
      'https://chrome.google.com/webstore/detail/etheraddresslookup/pdknmigbbbhmllnmgdfalmedcmcefdfn',
    text: 'Anti - Phishing Extension'
  }
];

interface Link {
  link: string;
  text: string;
}

interface Props {
  latestBlock: string;
}

export default class Footer extends React.PureComponent<Props> {
  public render() {
    return (
      <div>
        <OnboardModal />
        <PreFooter />
        <footer className="Footer" role="contentinfo" aria-label="footer">
          <div className="Footer-about">
            <p aria-hidden="true">
              <NewTabLink href="/">
                <img
                  className="Footer-about-logo"
                  src={logo}
                  height="55px"
                  width="auto"
                  alt="MyCrypto logo"
                />
              </NewTabLink>
            </p>
            <p className="Footer-about-text">{translate('FOOTER_1')}</p>

            <p className="Footer-copyright">
              &copy; {new Date().getFullYear()} MyCrypto, LLC{' '}
              <span className="Footer-copyright-spacer">&middot;</span> {VERSION}
            </p>

            <Disclaimer />
          </div>

          <div className="Footer-info">
            <h5>You can support us by buying a...</h5>
            <ul>
              <AffiliateTag link={ledgerReferralURL} text="Ledger Nano S" />
              <AffiliateTag link={trezorReferralURL} text="TREZOR" />
              <AffiliateTag link={bitboxReferralURL} text="Digital Bitbox" />
            </ul>

            <h5>
              <i aria-hidden="true">💝</i>
              {translate('FOOTER_2')}
            </h5>
            <ul>
              <li>
                ETH: <span className="mono wrap">{donationAddressMap.ETH}</span>
              </li>
              <li>
                {' '}
                BTC: <span className="mono wrap">{donationAddressMap.BTC}</span>
              </li>
            </ul>
          </div>

          <div className="Footer-links">
            {PRODUCT_INFO.map((productInfoItem, idx) => (
              <NewTabLink target="_blank" key={idx} href={productInfoItem.link}>
                {productInfoItem.text}
              </NewTabLink>
            ))}

            <div className="Footer-social-media-wrap">
              {SOCIAL_MEDIA.map((socialMediaItem, idx) => (
                <SocialMediaLink
                  link={socialMediaItem.link}
                  key={idx}
                  text={socialMediaItem.text}
                />
              ))}
            </div>
          </div>
        </footer>
      </div>
    );
  }
}
