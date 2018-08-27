import React from 'react';

import { Modal } from 'components/v2';
import logo from 'assets/images/v2-logo.png';
import chest from 'assets/images/v2-icn-chest.png';
import bankVsMyCrypto from 'assets/images/v2-icn-bank-vs-mycrypto.png';
import vault from 'assets/images/v2-icn-vault.png';
import champagne from 'assets/images/v2-icn-champagne.png';
import './OnboardingModal.scss';

function ProgressDots({ currentStep = 1, totalSteps = 4 }) {
  const dots = new Array(totalSteps).fill('ProgressDots-dot');

  // Replace the active page with a different dot.
  dots[currentStep - 1] = 'ProgressDots-dot ProgressDots-dot--active';

  return (
    <section className="ProgressDots">{dots.map(dot => <div key={dot} className={dot} />)}</section>
  );
}

function Slide({ children }) {
  return <section className="Slide">{children}</section>;
}

function FirstSlide() {
  return (
    <Slide>
      <section className="FirstSlide">
        <section className="FirstSlide-content">
          <h1>Welcome to MyCrypto.com</h1>
          <p>
            Please read the next few screens for your own safety. Your funds could be stolen if you
            do not pay attention to these warnings.
          </p>
          <button className="Button">Next</button>
        </section>
      </section>
    </Slide>
  );
}

export default function OnboardingModal({ currentSlide = 1 }) {
  const images = [chest, bankVsMyCrypto, vault, champagne];
  const logoImage = <img src={logo} alt="MyCrypto logo" />;
  const slideImage = <img src={images[currentSlide - 1]} alt="Slide art" />;
  const dots = <ProgressDots currentStep={currentSlide} totalSteps={4} />;
  const slides = [<FirstSlide />];
  const slide = slides[currentSlide - 1];

  return (
    <Modal>
      <section className="OnboardingModal">
        <section className="OnboardingModal-top">{logoImage}</section>
        <section className="OnboardingModal-side">
          <section className="OnboardingModal-side-top">{logoImage}</section>
          <section className="OnboardingModal-side-content">{slideImage}</section>
          <section className="OnboardingModal-side-bottom">{dots}</section>
        </section>
        <section className="OnboardingModal-content">{slide}</section>
        <section className="OnboardingModal-bottom">
          <section>{slideImage}</section>
          <section>{dots}</section>
        </section>
      </section>
    </Modal>
  );
}
