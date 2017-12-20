import React from 'react';
import OnboardSlide from './OnboardSlide';

const WhySlide = () => {
  const content = (
    <div>
      <h5>
        {/* translate="ONBOARD_why_content__1" */}
        Because we need you to understand that we **cannot**...
      </h5>
      <ul>
        <li className="text-danger">
          {/* translate="ONBOARD_why_content__2" */}
          Access your account or send your funds for you.
        </li>
        <li className="text-danger">
          {/* translate="ONBOARD_why_content__3" */}
          Recover or change your private key.
        </li>
        <li className="text-danger">
          {/* translate="ONBOARD_why_content__4" */}
          Recover or reset your password.
        </li>
        <li className="text-danger">
          {/* translate="ONBOARD_why_content__5" */}
          Reverse, cancel, or refund transactions.
        </li>
        <li className="text-danger">
          {/* translate="ONBOARD_why_content__6" */}
          Freeze accounts.
        </li>
      </ul>
      <h5>
        {/* translate="ONBOARD_why_content__7" */}
        **You** and **only you** are responsible for your security.
      </h5>
      <ul>
        <li>
          {/* translate="ONBOARD_why_content__8" */}
          Be diligent to keep your private key and password safe. Your private key is sometimes
          called your mnemonic phrase, keystore file, UTC file, JSON file, wallet file.
        </li>
        <li>
          {/* translate="ONBOARD_why_content__9" */}
          If lose your private key or password, no one can recover it.
        </li>
        <li>
          {/* translate="ONBOARD_why_content__10" */}
          If you enter your private key on a phishing website, you will have **all your funds
          taken**.
        </li>
      </ul>
    </div>
  );
  return (
    <OnboardSlide
      /* translate="ONBOARD_why_title" */
      header="Why are you making me read all this?"
      content={content}
    />
  );
};

export default WhySlide;
