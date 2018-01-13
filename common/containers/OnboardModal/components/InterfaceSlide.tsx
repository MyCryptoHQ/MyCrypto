import React from 'react';
import translate from 'translations';
import OnboardSlide from './OnboardSlide';
import onboardIconThree from 'assets/images/onboarding_icon-03.svg';

const InterfaceSlide = () => {
  const header = translate('ONBOARD_interface_title');

  const content = (
    <ul>
      <li>{translate('ONBOARD_interface_content__1')}</li>
      <li>{translate('ONBOARD_interface_content__2')}</li>
      <li>{translate('ONBOARD_interface_content__3')}</li>
      <li>{translate('ONBOARD_interface_content__4')}</li>
      <li>{translate('ONBOARD_interface_content__5')}</li>
      <li>{translate('ONBOARD_interface_content__6')}</li>
      <li>{translate('ONBOARD_interface_content__7')}</li>
    </ul>
  );
  return (
    <OnboardSlide header={header} content={content} image={onboardIconThree} imageSide="left" />
  );
};
export default InterfaceSlide;
