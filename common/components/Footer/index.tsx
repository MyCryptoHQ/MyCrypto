import logo from 'assets/images/logo-mycrypto.svg';
import {
  donationAddressMap,
  VERSION,
  knowledgeBaseURL,
  socialMediaLinks,
  productLinks,
  affiliateLinks,
  partnerLinks
} from 'config';
import React from 'react';
import PreFooter from './PreFooter';
import DisclaimerModal from 'components/DisclaimerModal';
import { NewTabLink } from 'components/ui';
import './index.scss';
import { translateRaw } from 'translations';

const SocialMediaLink = ({ link, text }: { link: string; text: string }) => {
  return (
    <NewTabLink className="SocialMediaLink" key={link} href={link} aria-label={text}>
      <i className={`sm-icon sm-logo-${text}`} />
    </NewTabLink>
  );
};

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
              {socialMediaLinks.map((socialMediaItem, idx) => (
                <SocialMediaLink
                  link={socialMediaItem.link}
                  key={idx}
                  text={socialMediaItem.text}
                />
              ))}
            </div>

            <div className="Footer-links-links">
              {productLinks.map(link => (
                <NewTabLink key={link.link} href={link.link}>
                  {link.text}
                </NewTabLink>
              ))}
              <NewTabLink href="mailto:press@mycrypto.com">
                {translateRaw('FOOTER_PRESS')}
              </NewTabLink>
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
              <NewTabLink href="https://about.mycrypto.com/privacy/">
                {translateRaw('FOOTER_PRIVACY_POLICY')}
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
              {affiliateLinks.map((link, i) => (
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
              {partnerLinks.map((link, i) => (
                <NewTabLink key={i} href={link.link}>
                  {link.text}
                </NewTabLink>
              ))}
            </div>
          </div>
        </footer>
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
