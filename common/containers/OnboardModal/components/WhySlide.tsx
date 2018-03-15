import React from 'react';
import translate from 'translations';
import OnboardSlide from './OnboardSlide';
import onboardIconFive from 'assets/images/onboarding/slide-05.svg';

const WhySlide = () => {
  const header = translate('ONBOARD_why_title');

  const content = (
    <div>
      <h5>{translate('ONBOARD_why_content__1', {}, true)}</h5>
      <ul>
        <li className="text-danger">{translate('ONBOARD_why_content__2', {}, true)}</li>
        <li className="text-danger">{translate('ONBOARD_why_content__3', {}, true)}</li>
        <li className="text-danger">{translate('ONBOARD_why_content__4', {}, true)}</li>
        <li className="text-danger">{translate('ONBOARD_why_content__5', {}, true)}</li>
        <li className="text-danger">{translate('ONBOARD_why_content__6', {}, true)}</li>
      </ul>
      <h5>{translate('ONBOARD_why_content__7', {}, true)}</h5>
      <ul>
        <li>{translate('ONBOARD_why_content__8', {}, true)}</li>
        <li>{translate('ONBOARD_why_content__9', {}, true)}</li>
        <li>{translate('ONBOARD_why_content__10', {}, true)}</li>
      </ul>
    </div>
  );
  return (
    <OnboardSlide header={header} content={content} image={onboardIconFive} imageSide="left" />
  );
};

export default WhySlide;
