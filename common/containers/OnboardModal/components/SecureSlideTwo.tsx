import React from 'react';
import translate from 'translations';
import OnboardSlide from './OnboardSlide';
import onboardIconEight from 'assets/images/onboarding/slide-08.svg';

const SecureSlideTwo = () => {
  const header = translate('ONBOARD_SECURE_2_TITLE');
  const subheader = translate('ONBOARD_SECURE_2_CONTENT__1');

  const content = (
    <ul>
      <li>{translate('ONBOARD_SECURE_2_CONTENT__2', {}, true)}</li>
      <li>{translate('ONBOARD_SECURE_2_CONTENT__3', {}, true)}</li>
      <li>{translate('ONBOARD_SECURE_2_CONTENT__4', {}, true)}</li>
      <li>{translate('ONBOARD_SECURE_2_CONTENT__5', {}, true)}</li>
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
