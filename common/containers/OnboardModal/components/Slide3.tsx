import React from 'react';
import logo from 'assets/images/logo-mycrypto-white.svg';
import img from 'assets/images/icn-vault.svg';
import './Slide.scss';

interface Props {
  stepper: JSX.Element;
  increment(): void;
}

export const Slide3 = (props: Props) => {
  const { stepper, increment } = props;
  return (
    <div className="Slide">
      <div className="Slide-supporting-info">
        <img className="Slide-supporting-info-myc-logo" src={logo} alt="MyCrypto Logo" />
        <img className="Slide-supporting-info-illustration" src={img} alt="chest" />
        {stepper}
      </div>
      <div className="Slide-content">
        <h1>Please understand that we can’t...</h1>
        <ul>
          <li>Access your funds</li>
          <li>Recover, reset, or modify any of your information</li>
          <li>Reverse, or cancel transactions</li>
          <li>Freeze accounts</li>
        </ul>
        <h1>You are responsible for...</h1>
        <ul>
          <li>Keeping your information safe</li>
          <li>Making sure you're not on a phishing site</li>
          <li>Reduceing risk by using our Desktop App</li>
        </ul>
        <button className="btn btn-primary" onClick={increment}>
          Next
        </button>
      </div>
    </div>
  );
};
