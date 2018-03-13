import React from 'react';
import { translateRaw, translateMarkdown } from 'translations';
import OnboardSlide from './OnboardSlide';
import onboardIconEight from 'assets/images/onboarding/slide-08.svg';

const SecureSlideTwo = () => {
  const header = translateRaw('ONBOARD_secure_2_title');
  const subheader = translateRaw('ONBOARD_secure_2_content__1');

  const content = (
    <ul>
      <li>{translateMarkdown('ONBOARD_secure_2_content__2')}</li>
      <li>{translateMarkdown('ONBOARD_secure_2_content__3')}</li>
      <li>{translateMarkdown('ONBOARD_secure_2_content__4')}</li>
      <li>{translateMarkdown('ONBOARD_secure_2_content__5')}</li>
    </ul>
  );

  return (
    <OnboardSlide
      header={header}
      subheader={subheader}
      content={content}
      image={onboardIconEight}
      imageSide="right"
    />
  );
};
export default SecureSlideTwo;
