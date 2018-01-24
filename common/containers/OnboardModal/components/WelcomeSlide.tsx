import React from 'react';
import OnboardSlide from './OnboardSlide';
import translate from 'translations';
import onboardIconOne from 'assets/images/onboarding_icon-01.svg';

import './WelcomeSlide.scss';

const WelcomeSlide = () => {
  const header = translate('ONBOARD_welcome_title');
  const subheader = <small>{translate('ONBOARD_welcome_content__3')}</small>;

  const content = (
    <div>
      <div className="WelcomeSlide-alert">
        <div className="WelcomeSlide-alert-icon">
          <i className="fa fa-exclamation-triangle" />
        </div>
        <span>
          {translate('ONBOARD_welcome_content__1')}
          {translate('ONBOARD_welcome_content__2')}
        </span>
      </div>
      <div className="WelcomeSlide-alert">
        <div className="WelcomeSlide-alert-icon">
          <i className="fa fa-exclamation-triangle" />
        </div>
        <span>{translate('ONBOARD_welcome_content__8')}</span>
      </div>
      <h5>{translate('ONBOARD_welcome_content__4')}</h5>
      <ul>
        <li>{translate('ONBOARD_welcome_content__5')}</li>
        <li>{translate('ONBOARD_welcome_content__6')}</li>
        <li>{translate('ONBOARD_welcome_content__7')}</li>
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
