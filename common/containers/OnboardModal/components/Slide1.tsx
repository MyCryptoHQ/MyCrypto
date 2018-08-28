import React from 'react';
import logo from 'assets/images/logo-mycrypto-white.svg';
import img from 'assets/images/icn-chest.svg';
import './Slide.scss';

interface Props {
  stepper: JSX.Element;
  increment(): void;
}

export const Slide1 = (props: Props) => {
  const { stepper, increment } = props;
  return (
    <div className="Slide">
      <div className="Slide-supporting-info">
        <img className="Slide-supporting-info-myc-logo" src={logo} alt="MyCrypto Logo" />
        <img className="Slide-supporting-info-illustration" src={img} alt="chest" />
        {stepper}
      </div>
      <div className="Slide-content">
        <h1>Welcome to MyCrypto.com</h1>
        <p>
          Please read the next few screens for your own safety. Your funds could be stolen if you do
          not pay attention to these warnings.
        </p>
        <button className="btn btn-primary" onClick={increment}>
          Next
        </button>
      </div>
    </div>
  );
};
