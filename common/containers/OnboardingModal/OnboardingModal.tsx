import React from 'react';
import { connect } from 'react-redux';

import { AppState } from 'features/reducers';
import { onboardingSelectors } from 'features/onboarding';
import { Modal } from 'components/v2';
import logo from 'assets/images/logo-mycrypto-white.svg';
import chest from 'assets/images/icn-chest.svg';
import bankVsMyCrypto from 'assets/images/icn-bank-vs-mycrypto.svg';
import vault from 'assets/images/icn-vault.svg';
import champagne from 'assets/images/icn-champagne.svg';
import { ProgressDots } from './components';
import { FirstSlide, SecondSlide, ThirdSlide, FourthSlide } from './slides';
import './OnboardingModal.scss';

interface StateProps {
  currentSlide: ReturnType<typeof onboardingSelectors.getSlide>;
}

function OnboardingModal({ currentSlide }: StateProps) {
  const images = [chest, bankVsMyCrypto, vault, champagne];
  const logoImage = <img src={logo} alt="MyCrypto logo" />;
  const slideImage = <img src={images[currentSlide - 1]} alt="Slide art" />;
  const slides = [
    <FirstSlide key={1} />,
    <SecondSlide key={2} />,
    <ThirdSlide key={3} />,
    <FourthSlide key={4} />
  ];
  const slide = slides[currentSlide - 1];

  return (
    <Modal>
      <section className="OnboardingModal">
        <section className="OnboardingModal-top">{logoImage}</section>
        <section className="OnboardingModal-middle">{slide}</section>
        <section className="OnboardingModal-bottom">
          {slideImage}
          <ProgressDots />
        </section>
        <section className="OnboardingModal-full">2</section>
      </section>
      {/* <section className="OnboardingModal">
        <section className="OnboardingModal-top">{logoImage}</section>
        <section className="OnboardingModal-side">
          <section className="OnboardingModal-side-top">{logoImage}</section>
          <section className="OnboardingModal-side-content">{slideImage}</section>
          <section className="OnboardingModal-side-bottom">
            <ProgressDots />
          </section>
        </section>
        <section className="OnboardingModal-content">{slide}</section>
        <section className="OnboardingModal-bottom">
          <section className="OnboardingModal-bottom-image">{slideImage}</section>
          <section>
            <ProgressDots />
          </section>
        </section>
      </section> */}
    </Modal>
  );
}

export default connect((state: AppState) => ({
  currentSlide: onboardingSelectors.getSlide(state)
}))(OnboardingModal);
