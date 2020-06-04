import React, { Component } from 'react';

import { socialMediaLinks, VERSION } from 'config';
import { translateRaw } from 'translations';
import { NewTabLink } from 'components/ui';
import DisclaimerModal from 'components/DisclaimerModal';
import './SocialsAndLegal.scss';

const SocialMediaLink = ({
  link,
  text,
  icon
}: {
  link: string;
  text: string;
  icon: null | string;
}) => {
  return (
    <NewTabLink className="SocialMediaLink" key={link} href={link} aria-label={text}>
      {icon !== null ? (
        <img src={icon} width="18.41px" height="18px" style={{ verticalAlign: 'top' }} />
      ) : (
        <i className={`sm-icon sm-logo-${text}`} />
      )}
    </NewTabLink>
  );
};

function Socials() {
  return (
    <section className="Socials">
      {socialMediaLinks.map((socialMediaItem, idx) => (
        <SocialMediaLink
          link={socialMediaItem.link}
          key={idx}
          text={socialMediaItem.text}
          icon={socialMediaItem.icon}
        />
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
