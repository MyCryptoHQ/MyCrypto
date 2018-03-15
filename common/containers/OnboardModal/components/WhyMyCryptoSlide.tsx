import React from 'react';
import translate from 'translations';
import OnboardSlide from './OnboardSlide';
import onboardIconSix from 'assets/images/onboarding/slide-06.svg';

const WhyMewSlide = () => {
  const header = translate('ONBOARD_WHYMYC_TITLE');

  const content = (
    <ul>
      <li>{translate('ONBOARD_WHYMYC_CONTENT__1', {}, true)}</li>
      <li>{translate('ONBOARD_WHYMYC_CONTENT__2', {}, true)}</li>
      <li>{translate('ONBOARD_WHYMYC_CONTENT__3', {}, true)}</li>
      <li>{translate('ONBOARD_WHYMYC_CONTENT__4', {}, true)}</li>
      <li>{translate('ONBOARD_WHYMYC_CONTENT__5', {}, true)}</li>
      <li>{translate('ONBOARD_WHYMYC_CONTENT__6', {}, true)}</li>
    </ul>
  );
  return <OnboardSlide header={header} content={content} image={onboardIconSix} imageSide="left" />;
};
export default WhyMewSlide;
