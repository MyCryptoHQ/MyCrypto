import React from 'react';

import logo from 'assets/images/logo-mycrypto.svg';
import ThemeToggle from 'components/Footer/ThemeToggle';
import SocialsAndLegal from './SocialsAndLegal';
import './LogoBox.scss';

export default function LogoBox() {
  return (
    <section className="LogoBox">
      <section className="LogoBox-image">
        <img src={logo} alt="Logo" />
        <section className="LogoBox-image-toggle">
          <ThemeToggle />
        </section>
      </section>
      <section className="LogoBox-text">
        <p>
          MyCrypto is an open-source, client-side tool for generating ether wallets, handling ERC-20
          tokens, and interacting with the blockchain more easily. Developed by and for the
          community since 2015, we’re focused on building awesome products that put the power in
          people’s hands.
        </p>
      </section>
      <section className="LogoBox-toggle">
        <ThemeToggle />
      </section>
      <section className="LogoBox-socials-legal">
        <SocialsAndLegal />
      </section>
    </section>
  );
}
