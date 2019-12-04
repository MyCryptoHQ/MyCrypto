import React from 'react';

import translate from 'v2/translations';
import logo from 'assets/images/logo-mycrypto.svg';
import SocialsAndLegal from './SocialsAndLegal';
import './LogoBox.scss';

export default function LogoBox() {
  return (
    <section className="LogoBox">
      <section className="LogoBox-image">
        <img src={logo} alt="Logo" />
      </section>
      <section className="LogoBox-text">
        <p>{translate('NEW_FOOTER_TEXT_13')}</p>
      </section>
      <section className="LogoBox-socials-legal">
        <SocialsAndLegal />
      </section>
    </section>
  );
}
