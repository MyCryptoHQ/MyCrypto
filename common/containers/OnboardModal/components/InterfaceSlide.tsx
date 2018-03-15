import React from 'react';
import translate from 'translations';
import OnboardSlide from './OnboardSlide';
import onboardIconThree from 'assets/images/onboarding/slide-03.svg';

const InterfaceSlide = () => {
  const header = translate('ONBOARD_INTERFACE_TITLE');

  const content = (
    <ul>
      <li>{translate('ONBOARD_INTERFACE_CONTENT__1', {}, true)}</li>
      <li>{translate('ONBOARD_INTERFACE_CONTENT__2', {}, true)}</li>
      <li>{translate('ONBOARD_INTERFACE_CONTENT__3', {}, true)}</li>
      <li>{translate('ONBOARD_INTERFACE_CONTENT__4', {}, true)}</li>
      <li>{translate('ONBOARD_INTERFACE_CONTENT__5', {}, true)}</li>
      <li>{translate('ONBOARD_INTERFACE_CONTENT__6', {}, true)}</li>
      <li>{translate('ONBOARD_INTERFACE_CONTENT__7', {}, true)}</li>
    </ul>
  );
  return (
    <OnboardSlide header={header} content={content} image={onboardIconThree} imageSide="left" />
  );
};
export default InterfaceSlide;
