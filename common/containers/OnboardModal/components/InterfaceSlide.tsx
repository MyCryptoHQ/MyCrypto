import React from 'react';
import translate, { translateMd } from 'translations';
import OnboardSlide from './OnboardSlide';
import onboardIconThree from 'assets/images/onboarding/slide-03.svg';

const InterfaceSlide = () => {
  const header = translate('ONBOARD_INTERFACE_TITLE');

  const content = (
    <ul>
      <li>{translateMd('ONBOARD_INTERFACE_CONTENT__1')}</li>
      <li>{translateMd('ONBOARD_INTERFACE_CONTENT__2')}</li>
      <li>{translateMd('ONBOARD_INTERFACE_CONTENT__3')}</li>
      <li>{translateMd('ONBOARD_INTERFACE_CONTENT__4')}</li>
      <li>{translateMd('ONBOARD_INTERFACE_CONTENT__5')}</li>
      <li>{translateMd('ONBOARD_INTERFACE_CONTENT__6')}</li>
      <li>{translateMd('ONBOARD_INTERFACE_CONTENT__7')}</li>
    </ul>
  );
  return (
    <OnboardSlide header={header} content={content} image={onboardIconThree} imageSide="left" />
  );
};
export default InterfaceSlide;
