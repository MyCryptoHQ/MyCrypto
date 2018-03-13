import React from 'react';
import { translateRaw, translateMarkdown } from 'translations';
import OnboardSlide from './OnboardSlide';
import onboardIconThree from 'assets/images/onboarding/slide-03.svg';

const InterfaceSlide = () => {
  const header = translateRaw('ONBOARD_interface_title');

  const content = (
    <ul>
      <li>{translateMarkdown('ONBOARD_interface_content__1')}</li>
      <li>{translateMarkdown('ONBOARD_interface_content__2')}</li>
      <li>{translateMarkdown('ONBOARD_interface_content__3')}</li>
      <li>{translateMarkdown('ONBOARD_interface_content__4')}</li>
      <li>{translateMarkdown('ONBOARD_interface_content__5')}</li>
      <li>{translateMarkdown('ONBOARD_interface_content__6')}</li>
      <li>{translateMarkdown('ONBOARD_interface_content__7')}</li>
    </ul>
  );
  return (
    <OnboardSlide header={header} content={content} image={onboardIconThree} imageSide="left" />
  );
};
export default InterfaceSlide;
