import React from 'react';

import translate from 'translations';
import onboardIconSix from 'assets/images/onboarding/slide-06.svg';
import OnboardSlide from './OnboardSlide';

const WhyMewSlide = () => {
  const header = translate('ONBOARD_WHYMYC_TITLE');

  const content = (
    <ul>
      <li>{translate('ONBOARD_WHYMYC_CONTENT__1')}</li>
      <li>{translate('ONBOARD_WHYMYC_CONTENT__2')}</li>
      <li>{translate('ONBOARD_WHYMYC_CONTENT__3')}</li>
      <li>{translate('ONBOARD_WHYMYC_CONTENT__4')}</li>
      <li>{translate('ONBOARD_WHYMYC_CONTENT__5')}</li>
      <li>{translate('ONBOARD_WHYMYC_CONTENT__6')}</li>
    </ul>
  );
  return <OnboardSlide header={header} content={content} image={onboardIconSix} imageSide="left" />;
};
export default WhyMewSlide;
