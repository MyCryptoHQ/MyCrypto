import React from 'react';
import onboardIconFive from 'assets/images/onboarding_icon-05.svg';

interface Props {
  setOnboardStatus(slideNumber: number): void;
}

const WhySlide: React.SFC<Props> = ({ setOnboardStatus }) => {
  return (
    <article className="onboarding__modal">
      <h3 className="onboarding__title">
        {/* translate="ONBOARD_why_title" */}
        Why are you making me read all this?
      </h3>
      <section className="row row--flex">
        <div className="col-xs-12 col-sm-4 onboarding__image">
          <img src={onboardIconFive} width="100%" height="auto" />
        </div>
        <div className="col-xs-12 col-sm-8 onboarding__content">
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
      </section>
      <div className="onboarding__buttons">
        <a onClick={() => setOnboardStatus(4)} className="btn btn-default">
          <span>
            {/* translate="ONBOARD_blockchain_title__alt" */}
            WTF is a Blockchain?
          </span>
        </a>
        <a onClick={() => setOnboardStatus(6)} className="btn btn-primary">
          <span>
            {/* translate="ONBOARD_point_title__alt */}
            What's the Point of MEW then?
          </span>
        </a>
      </div>
    </article>
  );
};
export default WhySlide;
