import React from 'react';

import translate from 'translations';
import ThemeToggle from 'components/Footer/ThemeToggle';
import SocialsAndLegal from './SocialsAndLegal';
import './LogoBox.scss';

export default function LogoBox() {
  return (
    <section className="LogoBox">
      <section className="LogoBox-title">
        <h2>{translate('NEW_FOOTER_TEXT_16')} MyCrypto</h2>
        <section className="LogoBox-image-toggle">
          <ThemeToggle />
        </section>
      </section>
      <section className="LogoBox-text">
        <p>{translate('NEW_FOOTER_TEXT_13')}</p>
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
