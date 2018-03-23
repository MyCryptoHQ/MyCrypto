import React from 'react';
import OnboardSlide from './OnboardSlide';
import translate from 'translations';
import onboardIconOne from 'assets/images/onboarding/slide-01.svg';

import './WelcomeSlide.scss';

const WelcomeSlide = () => {
  const header = translate('ONBOARD_WELCOME_TITLE');
  const subheader = <small>{translate('ONBOARD_WELCOME_CONTENT__3')}</small>;

  const content = (
    <div>
      <div className="WelcomeSlide-alert">
        <div className="WelcomeSlide-alert-icon">
          <i className="fa fa-exclamation-triangle" />
        </div>
        <span>
          {translate('ONBOARD_WELCOME_CONTENT__1')}
          {translate('ONBOARD_WELCOME_CONTENT__2')}
        </span>
      </div>
      <div className="WelcomeSlide-alert">
        <div className="WelcomeSlide-alert-icon">
          <i className="fa fa-exclamation-triangle" />
        </div>
        {translate('ONBOARD_WELCOME_CONTENT__8')}
      </div>
      <h5>{translate('ONBOARD_WELCOME_CONTENT__4')}</h5>
      <ul>
        <li>{translate('ONBOARD_WELCOME_CONTENT__5')}</li>
        <li>{translate('ONBOARD_WELCOME_CONTENT__6')}</li>
        <li>{translate('ONBOARD_WELCOME_CONTENT__7')}</li>
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
