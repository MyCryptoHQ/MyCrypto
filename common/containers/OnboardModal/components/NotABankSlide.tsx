import React from 'react';
import translate from 'translations';
import OnboardSlide from './OnboardSlide';
import onboardIconTwo from 'assets/images/onboarding/slide-02.svg';

const NotABankSlide = () => {
  const header = translate('ONBOARD_BANK_TITLE');

  const content = (
    <ul>
      <li>{translate('ONBOARD_BANK_CONTENT__1', {}, true)}</li>
      <li>{translate('ONBOARD_BANK_CONTENT__2', {}, true)}</li>
      <li>{translate('ONBOARD_BANK_CONTENT__3', {}, true)}</li>
      <li>{translate('ONBOARD_BANK_CONTENT__4', {}, true)}</li>
      <li>{translate('ONBOARD_BANK_CONTENT__5', {}, true)}</li>
    </ul>
  );

  return <OnboardSlide header={header} content={content} image={onboardIconTwo} imageSide="left" />;
};

export default NotABankSlide;
