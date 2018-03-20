import React from 'react';
import translate, { translateMd } from 'translations';
import OnboardSlide from './OnboardSlide';
import onboardIconTwo from 'assets/images/onboarding/slide-02.svg';

const NotABankSlide = () => {
  const header = translate('ONBOARD_BANK_TITLE');

  const content = (
    <ul>
      <li>{translateMd('ONBOARD_BANK_CONTENT__1')}</li>
      <li>{translateMd('ONBOARD_BANK_CONTENT__2')}</li>
      <li>{translateMd('ONBOARD_BANK_CONTENT__3')}</li>
      <li>{translateMd('ONBOARD_BANK_CONTENT__4')}</li>
      <li>{translateMd('ONBOARD_BANK_CONTENT__5')}</li>
    </ul>
  );

  return <OnboardSlide header={header} content={content} image={onboardIconTwo} imageSide="left" />;
};

export default NotABankSlide;
