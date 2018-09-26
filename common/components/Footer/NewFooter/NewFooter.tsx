import React from 'react';

import { socialMediaLinks } from 'config';
import logo from 'assets/images/logo-mycrypto.svg';
import { NewTabLink } from 'components/ui';
import ThemeToggle from 'components/Footer/ThemeToggle';
import './NewFooter.scss';

const SocialMediaLink = ({ link, text }: { link: string; text: string }) => {
  return (
    <NewTabLink className="SocialMediaLink" key={link} href={link} aria-label={text}>
      <i className={`sm-icon sm-logo-${text}`} />
    </NewTabLink>
  );
};

export default function NewFooter() {
  return (
    <section className="NewFooter">
      {/* Logo */}
      <section className="NewFooter-logo-container">
        <section className="NewFooter-logo-container-image">
          <img src={logo} alt="Logo" />
        </section>
        <section className="NewFooter-logo-container-text">
          <p>
            MyCrypto is an open-source, client-side tool for generating ether wallets, handling
            ERC-20 tokens, and interacting with the blockchain more easily. Developed by and for the
            community since 2015, we’re focused on building awesome products that put the power in
            people’s hands.
          </p>
        </section>
        <section className="NewFooter-logo-container-toggle">
          <ThemeToggle />
        </section>
      </section>
      {/* Actions */}
      <section className="NewFooter-actions-container">
        <section className="NewFooter-actions-container-donation">
          <p>Donate</p>
          <button>Ethereum</button>
          <button>Bitcoin</button>
        </section>
        <section className="NewFooter-actions-container-subscribe">
          <h2>Subscribe to MyCrypto</h2>
          <p>Get updates from MyCrypto straight to your inbox!</p>
          <section className="NewFooter-actions-container-subscribe-input">
            <input type="text" placeholder="Email address" />
            <button>Get Updates</button>
          </section>
        </section>
      </section>
      <section className="NewFooter-links-container">
        <section className="NewFooter-links-container-blocks">
          <section className="NewFooter-links-container-company">
            <h2>Company</h2>
            <ul>
              <li>MyCrypto.com</li>
              <li>Help & Support</li>
              <li>Our Team</li>
              <li>Press</li>
              <li>Privacy Policy</li>
            </ul>
          </section>
          <section className="NewFooter-links-container-support">
            <h2>Support Us</h2>
            <ul>
              <li>Ledger Wallet</li>
              <li>TREZOR</li>
              <li>Ether card</li>
            </ul>
          </section>
          <section className="NewFooter-links-container-other">
            <h2>Other Products</h2>
            <ul>
              <li>EtherAddressLookup</li>
              <li>EtherScamDB</li>
              <li>MoneroVision</li>
            </ul>
          </section>
        </section>

        <section className="NewFooter-links-container-linkset">
          {socialMediaLinks.map((socialMediaItem, idx) => (
            <SocialMediaLink link={socialMediaItem.link} key={idx} text={socialMediaItem.text} />
          ))}
        </section>
        <section className="NewFooter-links-container-legal">
          <p>© 2018 MyCrypto, Inc.</p>
          <p>Disclaimer</p>
          <p>v1.3.1</p>
        </section>
      </section>
    </section>
  );
}
