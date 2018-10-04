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

const MobileFooter = () => (
  <section className="mobile-only">
    <section className="NewFooter">
      <LogoBox />
      <HorizontalRule />
      <DonateAndSubscribe />
      <HorizontalRule />
      <Linkset />
      <SocialsAndLegal />
    </section>
  </section>
);

const TabletFooter = () => (
  <section className="tablet-only">
    <section className="NewFooter">
      <LogoBox />
      <VerticalRule />
      <section style={{ display: 'flex', flexDirection: 'column', flex: 5 }}>
        <Linkset />
        <DonateAndSubscribe />
      </section>
    </section>
  </section>
);

const DesktopFooter = () => (
  <section className="desktop-only">
    <section className="NewFooter">
      <LogoBox />
      <VerticalRule />
      <Linkset />
      <VerticalRule />
      <DonateAndSubscribe />
    </section>
  </section>
);

export default function NewFooter() {
  return (
    <React.Fragment>
      <MobileFooter />
      <TabletFooter />
      <DesktopFooter />
    </React.Fragment>
  );
}
