import React from 'react';

import translate from 'translations';
import onboardIconTwo from 'assets/images/onboarding/slide-02.svg';
import OnboardSlide from './OnboardSlide';

const NotABankSlide = () => {
  const header = translate('ONBOARD_BANK_TITLE');

  const content = (
    <ul>
      <li>{translate('ONBOARD_BANK_CONTENT__1')}</li>
      <li>{translate('ONBOARD_BANK_CONTENT__2')}</li>
      <li>{translate('ONBOARD_BANK_CONTENT__3')}</li>
      <li>{translate('ONBOARD_BANK_CONTENT__4')}</li>
      <li>{translate('ONBOARD_BANK_CONTENT__5')}</li>
    </ul>
  );

  return <OnboardSlide header={header} content={content} image={onboardIconTwo} imageSide="left" />;
};

export default NotABankSlide;
