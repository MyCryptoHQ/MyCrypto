import React from 'react';
import OnboardSlide from './OnboardSlide';

const WelcomeSlide = () => {
  const header = (
    <div>
      <span>
        {/* translate="ONBOARD_welcome_title"*/}
        Welcome to MyEtherWallet.com
      </span>
      <br />
      <small>
        {/* translate="ONBOARD_welcome_content__3"*/}
        We know this click-through shit is annoying. We are sorry.
      </small>
    </div>
  );
  const content = (
    <div>
      <p className="OnboardSlide-alert">
        <span>
          {/* translate="ONBOARD_welcome_content__1"*/}
          Please take some time to understand this for your own safety. 🙏
        </span>
        <span>
          {/* translate="ONBOARD_welcome_content__2"*/}
          Your funds will be stolen if you do not head these warnings.
        </span>
      </p>
      <p className="OnboardSlide-alert">
        {/* translate="ONBOARD_welcome_content__8"*/}
        We cannot recover your funds or freeze your account if you visit a phishing site or lose
        your private key.
      </p>
      <h5>
        {/* translate="ONBOARD_welcome_content__4"  */}
        What is MEW?
      </h5>
      <ul>
        <li>
          {/* translate="ONBOARD_welcome_content__5" */}
          MyEtherWallet is a free, open-source, client-side interface.
        </li>
        <li>
          {/* translate="ONBOARD_welcome_content__6" */}
          We allow you to interact directly with the blockchain while remaining in full control of
          your keys &amp; your funds.
        </li>
        <li>
          {/* translate="ONBOARD_welcome_content__7" */}
          <strong>You</strong> and <strong>only you</strong> are responsible for your security.
        </li>
      </ul>
    </div>
  );
  return <OnboardSlide header={header} content={content} />;
};

export default WelcomeSlide;
