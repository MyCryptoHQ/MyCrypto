import React from 'react';

import { socialMediaLinks } from 'config';
import { NewTabLink } from 'components/ui';
import './SocialsAndLegal.scss';

const SocialMediaLink = ({ link, text }: { link: string; text: string }) => {
  return (
    <NewTabLink className="SocialMediaLink" key={link} href={link} aria-label={text}>
      <i className={`sm-icon sm-logo-${text}`} />
    </NewTabLink>
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

function Legal() {
  return (
    <section className="Legal">
      <p>© 2018 MyCrypto, Inc.</p>
      <p>Disclaimer</p>
      <p>v1.3.1</p>
    </section>
  );
}

export default function SocialsAndLegal() {
  return (
    <section className="SocialsAndLegal">
      <Socials />
      <Legal />
    </section>
  );
}
