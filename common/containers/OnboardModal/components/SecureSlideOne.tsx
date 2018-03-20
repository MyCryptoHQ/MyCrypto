import React from 'react';
import translate from 'translations';
import OnboardSlide from './OnboardSlide';
import onboardIconSeven from 'assets/images/onboarding/slide-07.svg';

const SecureSlideOne = () => {
  const header = translate('ONBOARD_SECURE_1_TITLE');

  const content = (
    <div>
      <p>{translate('ONBOARD_SECURE_1_CONTENT__1')}</p>
      <ul>
        <li>{translate('ONBOARD_SECURE_1_CONTENT__2')}</li>
        <li>{translate('ONBOARD_SECURE_1_CONTENT__3')}</li>
        <li>{translate('ONBOARD_SECURE_1_CONTENT__4')}</li>
        <li>{translate('ONBOARD_SECURE_1_CONTENT__5')}</li>
        <li>{translate('ONBOARD_SECURE_1_CONTENT__6')}</li>
        <li>{translate('ONBOARD_SECURE_1_CONTENT__7')}</li>
      </ul>
    </div>
  );
  return (
    <OnboardSlide header={header} content={content} image={onboardIconSeven} imageSide="right" />
  );
};
export default SecureSlideOne;
