import React from 'react';
import translate from 'translations';
import OnboardSlide from './OnboardSlide';
import onboardIconEight from 'assets/images/onboarding_icon-08.svg';

const SecureSlideTwo = () => {
  const header = (
    <div>
      <span>{translate('ONBOARD_secure_2_title')}</span>
      <p>{translate('ONBOARD_secure_2_content__1')}</p>
      <br />
    </div>
  );

  const content = (
    <ul>
      <li>{translate('ONBOARD_secure_2_content__2')}</li>
      <li>{translate('ONBOARD_secure_2_content__3')}</li>
      <li>{translate('ONBOARD_secure_2_content__4')}</li>
      <li>{translate('ONBOARD_secure_2_content__5')}</li>
    </ul>
  );
  return <OnboardSlide header={header} content={content} slideImage={onboardIconEight} />;
};
export default SecureSlideTwo;
