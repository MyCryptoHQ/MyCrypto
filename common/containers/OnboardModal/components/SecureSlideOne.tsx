import React from 'react';
import { translateRaw, translateMarkdown } from 'translations';
import OnboardSlide from './OnboardSlide';
import onboardIconSeven from 'assets/images/onboarding/slide-07.svg';

const SecureSlideOne = () => {
  const header = translateRaw('ONBOARD_secure_1_title');

  const content = (
    <div>
      <p>{translateRaw('ONBOARD_secure_1_content__1')}</p>
      <ul>
        <li>{translateMarkdown('ONBOARD_secure_1_content__2')}</li>
        <li>{translateMarkdown('ONBOARD_secure_1_content__3')} </li>
        <li>{translateMarkdown('ONBOARD_secure_1_content__4')}</li>
        <li>{translateMarkdown('ONBOARD_secure_1_content__5')}</li>
        <li>{translateMarkdown('ONBOARD_secure_1_content__6')}</li>
        <li>{translateMarkdown('ONBOARD_secure_1_content__7')}</li>
      </ul>
    </div>
  );
  return (
    <OnboardSlide header={header} content={content} image={onboardIconSeven} imageSide="right" />
  );
};
export default SecureSlideOne;
