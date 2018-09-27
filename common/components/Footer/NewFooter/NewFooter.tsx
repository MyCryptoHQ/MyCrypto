import React from 'react';

import { DonateAndSubscribe, Linkset, LogoBox, SocialsAndLegal } from './components';
import './NewFooter.scss';

const HorizontalRule = () => (
  <section className="HorizontalRule">
    <section className="HorizontalRule-line" />
  </section>
);

const VerticalRule = () => (
  <section className="VerticalRule">
    <section className="VerticalRule-line" />
  </section>
);

export default function NewFooter() {
  return (
    <section className="NewFooter">
      <LogoBox />
      <HorizontalRule />
      <VerticalRule />
      <section className="desktop-only">
        <Linkset />
      </section>
      <section className="mobile-only">
        <DonateAndSubscribe />
      </section>
      <HorizontalRule />
      <VerticalRule />
      <section className="desktop-only">
        <DonateAndSubscribe />
      </section>
      <section className="mobile-only">
        <Linkset />
      </section>
      <section className="NewFooter-socials-legal">
        <SocialsAndLegal />
      </section>
    </section>
  );
}
