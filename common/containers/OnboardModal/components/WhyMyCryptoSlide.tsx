import React from 'react';
import translate, { translateMd } from 'translations';
import OnboardSlide from './OnboardSlide';
import onboardIconSix from 'assets/images/onboarding/slide-06.svg';

const WhyMewSlide = () => {
  const header = translate('ONBOARD_WHYMYC_TITLE');

  const content = (
    <ul>
      <li>{translateMd('ONBOARD_WHYMYC_CONTENT__1')}</li>
      <li>{translateMd('ONBOARD_WHYMYC_CONTENT__2')}</li>
      <li>{translateMd('ONBOARD_WHYMYC_CONTENT__3')}</li>
      <li>{translateMd('ONBOARD_WHYMYC_CONTENT__4')}</li>
      <li>{translateMd('ONBOARD_WHYMYC_CONTENT__5')}</li>
      <li>{translateMd('ONBOARD_WHYMYC_CONTENT__6')}</li>
    </ul>
  );
  return <OnboardSlide header={header} content={content} image={onboardIconSix} imageSide="left" />;
};
export default WhyMewSlide;
