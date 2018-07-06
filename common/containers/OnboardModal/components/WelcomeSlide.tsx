import React from 'react';

import translate from 'translations';
import onboardIconOne from 'assets/images/onboarding/slide-01.svg';
import { Warning } from 'components/ui';
import OnboardSlide from './OnboardSlide';

const WelcomeSlide = () => {
  const header = translate('ONBOARD_WELCOME_TITLE');
  const subheader = <small>{translate('ONBOARD_WELCOME_CONTENT__3')}</small>;

  const content = (
    <div>
      <Warning>
        {translate('ONBOARD_WELCOME_CONTENT__1')}
        {translate('ONBOARD_WELCOME_CONTENT__2')}
      </Warning>
      <Warning>{translate('ONBOARD_WELCOME_CONTENT__8')}</Warning>
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
