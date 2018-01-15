import React from 'react';
import translate from 'translations';
import OnboardSlide from './OnboardSlide';
import onboardIconFive from 'assets/images/onboarding_icon-05.svg';

const WhySlide = () => {
  const header = translate('ONBOARD_why_title');

  const content = (
    <div>
      <h5>{translate('ONBOARD_why_content__1')}</h5>
      <ul>
        <li className="text-danger">{translate('ONBOARD_why_content__2')}</li>
        <li className="text-danger">{translate('ONBOARD_why_content__3')}</li>
        <li className="text-danger">{translate('ONBOARD_why_content__4')}</li>
        <li className="text-danger">{translate('ONBOARD_why_content__5')}</li>
        <li className="text-danger">{translate('ONBOARD_why_content__6')}</li>
      </ul>
      <h5>{translate('ONBOARD_why_content__7')}</h5>
      <ul>
        <li>{translate('ONBOARD_why_content__8')}</li>
        <li>{translate('ONBOARD_why_content__9')}</li>
        <li>{translate('ONBOARD_why_content__10')}</li>
      </ul>
    </div>
  );
  return (
    <OnboardSlide header={header} content={content} image={onboardIconFive} imageSide="left" />
  );
};

export default WhySlide;
