import React, { Component } from 'react';

import { AnalyticsService, ANALYTICS_CATEGORIES } from 'v2/services';
import { socialMediaLinks, VERSION } from 'v2/config';
import { translateRaw } from 'translations';
import { DisclaimerModal, NewTabLink } from 'v2/components';
import './SocialsAndLegal.scss';

const SocialMediaLink = ({ link, text }: { link: string; text: string }) => {
  return (
    <NewTabLink
      className="SocialMediaLink"
      key={link}
      href={link}
      aria-label={text}
      onClick={() => trackSocialIconClicked(text)}
    >
      <i className={`sm-icon sm-logo-${text}`} />
    </NewTabLink>
  );
};

const trackSocialIconClicked = (socialNetworkName: string): void => {
  AnalyticsService.instance.track(
    ANALYTICS_CATEGORIES.FOOTER,
    `${socialNetworkName.charAt(0).toUpperCase()}${socialNetworkName.slice(1)} social icon clicked`
  );
};

function Socials() {
  return (
    <section className="Socials">
      {socialMediaLinks.map((socialMediaItem, idx) => (
        <SocialMediaLink link={socialMediaItem.link} key={idx} text={socialMediaItem.text} />
      ))}
    </section>
  );
}

interface LegalState {
  modalOpen: boolean;
}

class Legal extends Component {
  public state: LegalState = {
    modalOpen: false
  };

  public render() {
    const { modalOpen } = this.state;

    return (
      <React.Fragment>
        <section className="Legal">
          <p>© {new Date().getFullYear()} MyCrypto, Inc.</p>
          <a onClick={this.toggleModal}>{translateRaw('DISCLAIMER')}</a>
          <p>{VERSION}</p>
        </section>
        <DisclaimerModal isOpen={modalOpen} handleClose={this.toggleModal} />
      </React.Fragment>
    );
  }

  private toggleModal = () =>
    this.setState((prevState: LegalState) => ({
      modalOpen: !prevState.modalOpen
    }));
}

export default function SocialsAndLegal() {
  return (
    <section className="SocialsAndLegal">
      <Socials />
      <Legal />
    </section>
  );
}
