import React from 'react';
import logo from 'assets/images/logo-mycrypto-white.svg';
import img from 'assets/images/icn-bank-vs-mycrypto.svg';
import './Slide.scss';

interface Props {
  stepper: JSX.Element;
  increment(): void;
}

export const Slide2 = (props: Props) => {
  const { stepper, increment } = props;
  return (
    <div className="Slide">
      <div className="Slide-supporting-info">
        <img className="Slide-supporting-info-myc-logo" src={logo} alt="MyCrypto Logo" />
        <img className="Slide-supporting-info-illustration" src={img} alt="chest" />
        {stepper}
      </div>
      <div className="Slide-content">
        <h1>With Banks...</h1>
        <ul>
          <li>They control your account</li>
          <li>They own your information</li>
          <li>They add fees</li>
          <li>They tell you what you can do</li>
        </ul>
        <h1>With MyCrypto</h1>
        <ul>
          <li>You control your wallet</li>
          <li>You own your information</li>
          <li>No fees</li>
          <li>Free to do whatever you want</li>
        </ul>
        <button className="btn btn-primary" onClick={increment}>
          Next
        </button>
      </div>
    </div>
  );
};
