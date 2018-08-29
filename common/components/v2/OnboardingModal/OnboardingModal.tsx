import React from 'react';
import { connect } from 'react-redux';

import { AppState } from 'features/reducers';
import { onboardingActions, onboardingSelectors } from 'features/onboarding';
import { Modal } from 'components/v2';
import logo from 'assets/images/v2-logo.png';
import chest from 'assets/images/v2-icn-chest.png';
import bankVsMyCrypto from 'assets/images/v2-icn-bank-vs-mycrypto.png';
import vault from 'assets/images/v2-icn-vault.png';
import champagne from 'assets/images/v2-icn-champagne.png';
import trezor from 'assets/images/v2-icn-trezor.png';
import ledger from 'assets/images/v2-icn-ledger.png';
import './OnboardingModal.scss';

function UnconnectedProgressDots({ currentStep, setSlide }) {
  const dots = new Array(4).fill('ProgressDots-dot');

  // Replace the active page with a different dot.
  dots[currentStep - 1] = 'ProgressDots-dot ProgressDots-dot--active';

  return (
    <section className="ProgressDots">
      {dots.map((dot, index) => (
        <div key={index} className={dot} onClick={() => setSlide(index + 1)} />
      ))}
    </section>
  );
}

const ProgressDots = connect(
  (state: AppState) => ({
    currentStep: onboardingSelectors.getSlide(state)
  }),
  {
    setSlide: onboardingActions.setOnboardingSlide
  }
)(UnconnectedProgressDots);

function UnconnectedOnboardingButton({
  className = '',
  currentSlide,
  completeOnboarding,
  setSlide
}) {
  const fullClassName = `Button ${className || ''}`;
  const nextSlide = currentSlide + 1;
  let onClick = () => setSlide(nextSlide);
  let text = 'Next';

  if (nextSlide > 4) {
    onClick = completeOnboarding;
    text = 'Get Started';
  }

  return (
    <button className={fullClassName} onClick={onClick}>
      {text}
    </button>
  );
}

const OnboardingButton = connect(
  (state: AppState) => ({
    currentSlide: onboardingSelectors.getSlide(state)
  }),
  {
    completeOnboarding: onboardingActions.completeOnboarding,
    setSlide: onboardingActions.setOnboardingSlide
  }
)(UnconnectedOnboardingButton);

function HardwareWalletChoice({ image, text }) {
  return (
    <section className="HardwareWalletChoice">
      <section className="HardwareWalletChoice-image">
        <img src={image} alt={text} />
      </section>
      <section className="HardwareWalletChoice-text">
        <p>{text}</p>
      </section>
    </section>
  );
}

function FirstSlide() {
  return (
    <section className="FirstSlide">
      <section className="FirstSlide-content">
        <h1 className="FirstSlide-content-heading">Welcome to MyCrypto.com</h1>
        <p className="FirstSlide-content-text">
          Please read the next few screens for your own safety. <br />
          Your funds could be stolen if you do not pay attention to these warnings.
        </p>
        <OnboardingButton />
      </section>
    </section>
  );
}

function SecondSlide() {
  return (
    <section className="SecondSlide">
      <section className="SecondSlide-content">
        <section className="SecondSlide-content-segment">
          <h1 className="SecondSlide-content-heading">With Banks...</h1>
          <p className="SecondSlide-content-text">
            They control your account <br />
            They own your info <br />
            They add fees <br />
            They tell you what you can do <br />
          </p>
          <OnboardingButton className="horizontal" />
        </section>
        <section className="SecondSlide-content-segment">
          <h1 className="SecondSlide-content-heading">With MyCrypto...</h1>
          <p className="SecondSlide-content-text">
            You control your ”account” <br />
            You own your info <br />
            No fees are added <br />
            You do whatever you want <br />
          </p>
        </section>
        <OnboardingButton className="vertical" />
      </section>
    </section>
  );
}

function ThirdSlide() {
  return (
    <section className="ThirdSlide">
      <section className="ThirdSlide-content">
        <section>
          <h1 className="ThirdSlide-content-heading">Please understand that we can't...</h1>
          <ul className="ThirdSlide-content-text">
            <li>Access your funds for you</li>
            <li>Recover, reset, or modify ANY of your information</li>
            <li>Reverse, cancel, or refund transactions</li>
            <li>Freeze accounts</li>
          </ul>
        </section>
        <section>
          <section>
            <h1 className="ThirdSlide-content-heading">You're responsible for...</h1>
            <ul className="ThirdSlide-content-text">
              <li>
                Keeping your information safe. This includes:
                <ul>
                  <li>Private Keys/Mnemonic Phrases</li>
                  <li>JSON files</li>
                  <li>Hardware wallet PINs</li>
                </ul>
              </li>
              <li>Making sure you're not on a phishing site</li>
              <li>Reducing risk by using the MyCrypto downloadable app</li>
            </ul>
          </section>
          <OnboardingButton />
        </section>
      </section>
    </section>
  );
}

function FourthSlide() {
  return (
    <section className="FourthSlide">
      <section className="FourthSlide-content">
        <h1 className="FourthSlide-content-heading">You're ready to get started!</h1>
        <p className="FourthSlide-content-text">
          Pro-Tip: in order for your funds to be the most secure, we recommend getting a hardware
          wallet to use with MyCrypto. Here are a few options we love:
        </p>
        <section className="FourthSlide-content-wallets">
          <HardwareWalletChoice image={trezor} text="Get a Trezor" />
          <HardwareWalletChoice image={ledger} text="Get a Ledger" />
        </section>
        <p className="FourthSlide-content-text">
          Need more info before you dive in? See Support Center
        </p>
        <OnboardingButton />
      </section>
    </section>
  );
}

function OnboardingModal({ currentSlide }) {
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
