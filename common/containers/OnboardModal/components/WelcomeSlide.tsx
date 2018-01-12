import React from 'react';
import OnboardSlide from './OnboardSlide';
import translate from 'translations';
import onboardIconOne from 'assets/images/onboarding_icon-01.svg';

import './WelcomeSlide.scss';

const WelcomeSlide = () => {
  const header = (
    <div>
      <span>{translate('ONBOARD_welcome_title')}</span>
      <br />
      <small>{translate('ONBOARD_welcome_content__3')}</small>
    </div>
  );
  const content = (
    <div>
      <p className="WelcomeSlide-alert">
        <span>{translate('ONBOARD_welcome_content__1')}</span>
        <span>{translate('ONBOARD_welcome_content__2')}</span>
      </p>
      <p className="WelcomeSlide-alert">{translate('ONBOARD_welcome_content__8')}</p>
      <h5>{translate('ONBOARD_welcome_content__4')}</h5>
      <ul>
        <li>{translate('ONBOARD_welcome_content__5')}</li>
        <li>{translate('ONBOARD_welcome_content__6')}</li>
        <li>{translate('ONBOARD_welcome_content__7')}</li>
      </ul>
    </div>
  );
  return <OnboardSlide header={header} content={content} slideImage={onboardIconOne} />;
};

export default WelcomeSlide;
