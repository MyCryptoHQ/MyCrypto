import React from 'react';
import OnboardSlide from './OnboardSlide';
import './WelcomeSlide.scss';

const WelcomeSlide = () => {
  const header = (
    <div>
      <span>Welcome to MyEtherWallet.com</span>
      <br />
      <small>We know this click-through shit is annoying. We are sorry.</small>
    </div>
  );
  const content = (
    <div>
      <p className="WelcomeSlide-alert">
        <span>Please take some time to understand this for your own safety. 🙏</span>
        <span>Your funds will be stolen if you do not head these warnings.</span>
      </p>
      <p className="WelcomeSlide-alert">
        We cannot recover your funds or freeze your account if you visit a phishing site or lose
        your private key.
      </p>
      <h5>What is MEW?</h5>
      <ul>
        <li>MyEtherWallet is a free, open-source, client-side interface.</li>
        <li>
          We allow you to interact directly with the blockchain while remaining in full control of
          your keys &amp; your funds.
        </li>
        <li>
          <strong>You</strong> and <strong>only you</strong> are responsible for your security.
        </li>
      </ul>
    </div>
  );
  return <OnboardSlide header={header} content={content} />;
};

export default WelcomeSlide;
