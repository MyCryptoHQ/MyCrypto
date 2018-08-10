import React from 'react';

import translate from 'translations';
import onboardIconEight from 'assets/images/onboarding/slide-08.svg';
import OnboardSlide from './OnboardSlide';

const SecureSlideTwo = () => {
  const header = translate('ONBOARD_SECURE_2_TITLE');
  const subheader = translate('ONBOARD_SECURE_2_CONTENT__1');

  const content = (
    <ul>
      <li>{translate('ONBOARD_SECURE_2_CONTENT__2')}</li>
      <li>{translate('ONBOARD_SECURE_2_CONTENT__3')}</li>
      <li>{translate('ONBOARD_SECURE_2_CONTENT__4')}</li>
      <li>{translate('ONBOARD_SECURE_2_CONTENT__5')}</li>
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
