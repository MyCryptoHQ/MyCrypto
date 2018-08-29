import React from 'react';
import { connect } from 'react-redux';

import { AppState } from 'features/reducers';
import { onboardingSelectors } from 'features/onboarding';
import { Modal } from 'components/v2';
import logo from 'assets/images/v2-logo.png';
import chest from 'assets/images/v2-icn-chest.png';
import bankVsMyCrypto from 'assets/images/v2-icn-bank-vs-mycrypto.png';
import vault from 'assets/images/v2-icn-vault.png';
import champagne from 'assets/images/v2-icn-champagne.png';
import { ProgressDots } from './components';
import { FirstSlide, SecondSlide, ThirdSlide, FourthSlide } from './slides';
import './OnboardingModal.scss';

type StateProps = {
  currentSlide: ReturnType<typeof onboardingSelectors.getSlide>;
};

function OnboardingModal({ currentSlide }: StateProps) {
  const images = [chest, bankVsMyCrypto, vault, champagne];
  const logoImage = <img src={logo} alt="MyCrypto logo" />;
  const slideImage = <img src={images[currentSlide - 1]} alt="Slide art" />;
  const slides = [<FirstSlide />, <SecondSlide />, <ThirdSlide />, <FourthSlide />];
  const slide = slides[currentSlide - 1];

  return (
    <Modal>
      <section className="OnboardingModal">
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
          <section>{slideImage}</section>
          <section>
            <ProgressDots />
          </section>
        </section>
      </section>
    </Modal>
  );
}

export default connect((state: AppState) => ({
  currentSlide: onboardingSelectors.getSlide(state)
}))(OnboardingModal);
