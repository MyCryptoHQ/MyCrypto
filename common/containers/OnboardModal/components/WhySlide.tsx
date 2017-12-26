import React from 'react';
import OnboardSlide from './OnboardSlide';

const WhySlide = () => {
  const content = (
    <div>
      <h5>
        Because we need you to understand that we <strong>cannot</strong>...
      </h5>
      <ul>
        <li className="text-danger">Access your account or send your funds for you.</li>
        <li className="text-danger">Recover or change your private key.</li>
        <li className="text-danger">Recover or reset your password.</li>
        <li className="text-danger">Reverse, cancel, or refund transactions.</li>
        <li className="text-danger">Freeze accounts.</li>
      </ul>
      <h5>
        <strong>You</strong> and <strong>only you</strong> are responsible for your security.
      </h5>
      <ul>
        <li>
          Be diligent to keep your private key and password safe. Your private key is sometimes
          called your mnemonic phrase, keystore file, UTC file, JSON file, wallet file.
        </li>
        <li>If lose your private key or password, no one can recover it.</li>
        <li>
          If you enter your private key on a phishing website, you will have{' '}
          <strong>all your funds taken</strong>.
        </li>
      </ul>
    </div>
  );
  return <OnboardSlide header="Why are you making me read all this?" content={content} />;
};

export default WhySlide;
