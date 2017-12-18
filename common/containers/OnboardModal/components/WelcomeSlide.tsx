import React from 'react';
import onboardIconOne from 'assets/images/onboarding_icon-01.svg';

interface Props {
  setOnboardStatus(slideNumber: number): void;
}

const WelcomeSlide: React.SFC<Props> = ({ setOnboardStatus }) => {
  return (
    <article className="onboarding__modal">
      <h3 className="onboarding__title">
        <span>
          {/* translate="ONBOARD_welcome_title"*/}
          Welcome to MyEtherWallet.com
        </span>
        <br />
        <small>
          {/* translate="ONBOARD_welcome_content__3"*/}
          We know this click-through shit is annoying. We are sorry.
        </small>
      </h3>
      <section className="row row--flex">
        <div className="col-xs-12 col-sm-7 onboarding__content">
          <p className="alert-danger--outline">
            <span>
              {/* translate="ONBOARD_welcome_content__1"*/}
              Please take some time to understand this for your own safety. 🙏
            </span>
            <span>
              {/* translate="ONBOARD_welcome_content__2"*/}
              Your funds will be stolen if you do not head these warnings.
            </span>
          </p>
          <p className="alert-danger--outline">
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
              We allow you to interact directly with the blockchain while remaining in full control
              of your keys &amp; your funds.
            </li>
            <li>
              {/* translate="ONBOARD_welcome_content__7" */}
              **You** and **only you** are responsible for your security.
            </li>
          </ul>
        </div>
        <div className="col-xs-12 col-sm-5 onboarding__image">
          <img src={onboardIconOne} width="100%" height="auto" />
        </div>
      </section>
      <div className="onboarding__buttons text-center">
        <a onClick={() => setOnboardStatus(2)} className="btn btn-primary">
          <span>
            {/* translate="ONBOARD_bank_title" */}
            MyEtherWallet is not a Bank
          </span>
        </a>
      </div>
    </article>
  );
};

export default WelcomeSlide;
