import React from 'react';
import translate from 'translations';
import OnboardSlide from './OnboardSlide';
import onboardIconSeven from 'assets/images/onboarding/slide-07.svg';

const SecureSlideOne = () => {
  const header = translate('ONBOARD_SECURE_1_TITLE');

  const content = (
    <div>
      <p>{translate('ONBOARD_SECURE_1_CONTENT__1', {}, true)}</p>
      <ul>
        <li>{translate('ONBOARD_SECURE_1_CONTENT__2', {}, true)}</li>
        <li>{translate('ONBOARD_SECURE_1_CONTENT__3', {}, true)} </li>
        <li>{translate('ONBOARD_SECURE_1_CONTENT__4', {}, true)}</li>
        <li>{translate('ONBOARD_SECURE_1_CONTENT__5', {}, true)}</li>
        <li>{translate('ONBOARD_SECURE_1_CONTENT__6', {}, true)}</li>
        <li>{translate('ONBOARD_SECURE_1_CONTENT__7', {}, true)}</li>
      </ul>
    </div>
  );
  return (
    <OnboardSlide header={header} content={content} image={onboardIconSeven} imageSide="right" />
  );
};
export default SecureSlideOne;
