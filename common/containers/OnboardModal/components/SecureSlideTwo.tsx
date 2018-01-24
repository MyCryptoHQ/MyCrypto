import React from 'react';
import translate from 'translations';
import OnboardSlide from './OnboardSlide';
import onboardIconEight from 'assets/images/onboarding_icon-08.svg';

const SecureSlideTwo = () => {
  const header = translate('ONBOARD_secure_2_title');
  const subheader = translate('ONBOARD_secure_2_content__1');

  const content = (
    <ul>
      <li>{translate('ONBOARD_secure_2_content__2')}</li>
      <li>{translate('ONBOARD_secure_2_content__3')}</li>
      <li>{translate('ONBOARD_secure_2_content__4')}</li>
      <li>{translate('ONBOARD_secure_2_content__5')}</li>
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
