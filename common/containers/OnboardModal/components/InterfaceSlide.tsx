import React from 'react';

import translate from 'translations';
import onboardIconThree from 'assets/images/onboarding/slide-03.svg';
import OnboardSlide from './OnboardSlide';

const InterfaceSlide = () => {
  const header = translate('ONBOARD_INTERFACE_TITLE');

  const content = (
    <ul>
      <li>{translate('ONBOARD_INTERFACE_CONTENT__1')}</li>
      <li>{translate('ONBOARD_INTERFACE_CONTENT__2')}</li>
      <li>{translate('ONBOARD_INTERFACE_CONTENT__3')}</li>
      <li>{translate('ONBOARD_INTERFACE_CONTENT__4')}</li>
      <li>{translate('ONBOARD_INTERFACE_CONTENT__5')}</li>
      <li>{translate('ONBOARD_INTERFACE_CONTENT__6')}</li>
      <li>{translate('ONBOARD_INTERFACE_CONTENT__7')}</li>
    </ul>
  );
  return (
    <OnboardSlide header={header} content={content} image={onboardIconThree} imageSide="left" />
  );
};
export default InterfaceSlide;
