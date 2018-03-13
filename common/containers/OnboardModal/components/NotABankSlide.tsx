import React from 'react';
import { translateRaw, translateMarkdown } from 'translations';
import OnboardSlide from './OnboardSlide';
import onboardIconTwo from 'assets/images/onboarding/slide-02.svg';

const NotABankSlide = () => {
  const header = translateRaw('ONBOARD_bank_title');

  const content = (
    <ul>
      <li>{translateMarkdown('ONBOARD_bank_content__1')}</li>
      <li>{translateMarkdown('ONBOARD_bank_content__2')}</li>
      <li>{translateMarkdown('ONBOARD_bank_content__3')}</li>
      <li>{translateMarkdown('ONBOARD_bank_content__4')}</li>
      <li>{translateMarkdown('ONBOARD_bank_content__5')}</li>
    </ul>
  );

  return <OnboardSlide header={header} content={content} image={onboardIconTwo} imageSide="left" />;
};

export default NotABankSlide;
