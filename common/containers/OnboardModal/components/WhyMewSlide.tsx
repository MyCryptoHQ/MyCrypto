import React from 'react';
import translate from 'translations';
import OnboardSlide from './OnboardSlide';
import onboardIconSix from 'assets/images/onboarding_icon-06.svg';

const WhyMewSlide = () => {
  const header = translate('ONBOARD_whymew_title');

  const content = (
    <ul>
      <li>{translate('ONBOARD_whymew_content__1')}</li>
      <li>{translate('ONBOARD_whymew_content__2')}</li>
      <li>{translate('ONBOARD_whymew_content__3')}</li>
      <li>{translate('ONBOARD_whymew_content__4')}</li>
      <li>{translate('ONBOARD_whymew_content__5')}</li>
      <li>{translate('ONBOARD_whymew_content__6')}</li>
    </ul>
  );
  return <OnboardSlide header={header} content={content} image={onboardIconSix} imageSide="left" />;
};
export default WhyMewSlide;
