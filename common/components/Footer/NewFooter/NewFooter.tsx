import React from 'react';

import { DonateAndSubscribe, Linkset, LogoBox, SocialsAndLegal } from './components';
import './NewFooter.scss';

const HorizontalRule = () => (
  <section className="HorizontalRule">
    <section className="HorizontalRule-line" />
  </section>
);

export default function NewFooter() {
  return (
    <section className="NewFooter">
      <LogoBox />
      <HorizontalRule />
      <DonateAndSubscribe />
      <HorizontalRule />
      <Linkset />
      <section className="NewFooter-socials-legal">
        <SocialsAndLegal />
      </section>
    </section>
  );
}
