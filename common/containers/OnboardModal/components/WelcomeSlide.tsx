import React from 'react';
import OnboardSlide from './OnboardSlide';
import { translateRaw, translateMarkdown } from 'translations';
import onboardIconOne from 'assets/images/onboarding/slide-01.svg';

import './WelcomeSlide.scss';

const WelcomeSlide = () => {
  const header = translateRaw('ONBOARD_welcome_title');
  const subheader = <small>{translateMarkdown('ONBOARD_welcome_content__3')}</small>;

  const content = (
    <div>
      <div className="WelcomeSlide-alert">
        <div className="WelcomeSlide-alert-icon">
          <i className="fa fa-exclamation-triangle" />
        </div>
        <span>
          {translateMarkdown('ONBOARD_welcome_content__1')}
          {translateMarkdown('ONBOARD_welcome_content__2')}
        </span>
      </div>
      <div className="WelcomeSlide-alert">
        <div className="WelcomeSlide-alert-icon">
          <i className="fa fa-exclamation-triangle" />
        </div>
        {translateMarkdown('ONBOARD_welcome_content__8')}
      </div>
      <h5>{translateMarkdown('ONBOARD_welcome_content__4')}</h5>
      <ul>
        <li>{translateMarkdown('ONBOARD_welcome_content__5')}</li>
        <li>{translateMarkdown('ONBOARD_welcome_content__6')}</li>
        <li>{translateMarkdown('ONBOARD_welcome_content__7')}</li>
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
