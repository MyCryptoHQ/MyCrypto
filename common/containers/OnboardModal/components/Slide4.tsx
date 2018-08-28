import React from 'react';
import logo from 'assets/images/logo-mycrypto-white.svg';
import img from 'assets/images/icn-champagne.svg';
import './Slide.scss';

interface Props {
  stepper: JSX.Element;
  onComplete(): void;
}

export const Slide4 = (props: Props) => {
  const { stepper, onComplete } = props;
  return (
    <div className="Slide">
      <div className="Slide-supporting-info">
        <img className="Slide-supporting-info-myc-logo" src={logo} alt="MyCrypto Logo" />
        <img className="Slide-supporting-info-illustration" src={img} alt="chest" />
        {stepper}
      </div>
      <div className="Slide-content">
        <h1>You're ready to get started</h1>
        <p>
          Tip: In order for your funds to be the most secure, we recommend getting a hardware wallet
          to use with MyCrypto. Here are a few options we love:
        </p>
        <p>Need more info before you dive in? See Support Center</p>
        <button className="btn btn-primary" onClick={onComplete}>
          Get Started
        </button>
      </div>
    </div>
  );
};
