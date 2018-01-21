import React from 'react';
import translate from 'translations';
import OnboardSlide from './OnboardSlide';
import onboardIconTwo from 'assets/images/onboarding_icon-02.svg';

const NotABankSlide = () => {
  const header = translate('ONBOARD_bank_title');

  const content = (
    <ul>
      <li>{translate('ONBOARD_bank_content__1')}</li>
      <li>{translate('ONBOARD_bank_content__2')}</li>
      <li>{translate('ONBOARD_bank_content__3')}</li>
      <li>{translate('ONBOARD_bank_content__4')}</li>
      <li>{translate('ONBOARD_bank_content__5')}</li>
    </ul>
  );

  return <OnboardSlide header={header} content={content} image={onboardIconTwo} imageSide="left" />;
};

export default NotABankSlide;
