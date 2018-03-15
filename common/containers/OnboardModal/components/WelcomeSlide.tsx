import React from 'react';
import OnboardSlide from './OnboardSlide';
import translate from 'translations';
import onboardIconOne from 'assets/images/onboarding/slide-01.svg';

import './WelcomeSlide.scss';

const WelcomeSlide = () => {
  const header = translate('ONBOARD_welcome_title');
  const subheader = <small>{translate('ONBOARD_welcome_content__3', {}, true)}</small>;

  const content = (
    <div>
      <div className="WelcomeSlide-alert">
        <div className="WelcomeSlide-alert-icon">
          <i className="fa fa-exclamation-triangle" />
        </div>
        <span>
          {translate('ONBOARD_welcome_content__1', {}, true)}
          {translate('ONBOARD_welcome_content__2', {}, true)}
        </span>
      </div>
      <div className="WelcomeSlide-alert">
        <div className="WelcomeSlide-alert-icon">
          <i className="fa fa-exclamation-triangle" />
        </div>
        {translate('ONBOARD_welcome_content__8', {}, true)}
      </div>
      <h5>{translate('ONBOARD_welcome_content__4', {}, true)}</h5>
      <ul>
        <li>{translate('ONBOARD_welcome_content__5', {}, true)}</li>
        <li>{translate('ONBOARD_welcome_content__6', {}, true)}</li>
        <li>{translate('ONBOARD_welcome_content__7', {}, true)}</li>
      </ul>
    </div>
  );

  return (
    <OnboardSlide
      header={header}
      subheader={subheader}
      content={content}
      image={onboardIconOne}
      imageSide="right"
    />
  );
};

export default WelcomeSlide;
