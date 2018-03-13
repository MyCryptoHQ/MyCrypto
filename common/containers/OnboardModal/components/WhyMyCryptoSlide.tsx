import React from 'react';
import { translateRaw, translateMarkdown } from 'translations';
import OnboardSlide from './OnboardSlide';
import onboardIconSix from 'assets/images/onboarding/slide-06.svg';

const WhyMewSlide = () => {
  const header = translateRaw('ONBOARD_whymyc_title');

  const content = (
    <ul>
      <li>{translateMarkdown('ONBOARD_whymyc_content__1')}</li>
      <li>{translateMarkdown('ONBOARD_whymyc_content__2')}</li>
      <li>{translateMarkdown('ONBOARD_whymyc_content__3')}</li>
      <li>{translateMarkdown('ONBOARD_whymyc_content__4')}</li>
      <li>{translateMarkdown('ONBOARD_whymyc_content__5')}</li>
      <li>{translateMarkdown('ONBOARD_whymyc_content__6')}</li>
    </ul>
  );
  return <OnboardSlide header={header} content={content} image={onboardIconSix} imageSide="left" />;
};
export default WhyMewSlide;
