import React from 'react';
import translate from 'translations';
import OnboardSlide from './OnboardSlide';
import onboardIconFive from 'assets/images/onboarding/slide-05.svg';

const WhySlide = () => {
  const header = translate('ONBOARD_WHY_TITLE');

  const content = (
    <div>
      <h5>{translate('ONBOARD_WHY_CONTENT__1', {}, true)}</h5>
      <ul>
        <li className="text-danger">{translate('ONBOARD_WHY_CONTENT__2', {}, true)}</li>
        <li className="text-danger">{translate('ONBOARD_WHY_CONTENT__3', {}, true)}</li>
        <li className="text-danger">{translate('ONBOARD_WHY_CONTENT__4', {}, true)}</li>
        <li className="text-danger">{translate('ONBOARD_WHY_CONTENT__5', {}, true)}</li>
        <li className="text-danger">{translate('ONBOARD_WHY_CONTENT__6', {}, true)}</li>
      </ul>
      <h5>{translate('ONBOARD_WHY_CONTENT__7', {}, true)}</h5>
      <ul>
        <li>{translate('ONBOARD_WHY_CONTENT__8', {}, true)}</li>
        <li>{translate('ONBOARD_WHY_CONTENT__9', {}, true)}</li>
        <li>{translate('ONBOARD_WHY_CONTENT__10', {}, true)}</li>
      </ul>
    </div>
  );
  return (
    <OnboardSlide header={header} content={content} image={onboardIconFive} imageSide="left" />
  );
};

export default WhySlide;
