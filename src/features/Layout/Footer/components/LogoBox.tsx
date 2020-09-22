import React from 'react';

import Icon from '@components/Icon';
import translate from '@translations';

import SocialsAndLegal from './SocialsAndLegal';
import './LogoBox.scss';

export default function LogoBox() {
  return (
    <section className="LogoBox">
      <section className="LogoBox-image">
        <Icon type="logo-mycrypto-text" alt="Logo" />
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
