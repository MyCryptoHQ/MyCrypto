import React from 'react';
import { translateRaw, translateMarkdown } from 'translations';
import OnboardSlide from './OnboardSlide';
import onboardIconFive from 'assets/images/onboarding/slide-05.svg';

const WhySlide = () => {
  const header = translateRaw('ONBOARD_why_title');

  const content = (
    <div>
      <h5>{translateMarkdown('ONBOARD_why_content__1')}</h5>
      <ul>
        <li className="text-danger">{translateMarkdown('ONBOARD_why_content__2')}</li>
        <li className="text-danger">{translateMarkdown('ONBOARD_why_content__3')}</li>
        <li className="text-danger">{translateMarkdown('ONBOARD_why_content__4')}</li>
        <li className="text-danger">{translateMarkdown('ONBOARD_why_content__5')}</li>
        <li className="text-danger">{translateMarkdown('ONBOARD_why_content__6')}</li>
      </ul>
      <h5>{translateMarkdown('ONBOARD_why_content__7')}</h5>
      <ul>
        <li>{translateMarkdown('ONBOARD_why_content__8')}</li>
        <li>{translateMarkdown('ONBOARD_why_content__9')}</li>
        <li>{translateMarkdown('ONBOARD_why_content__10')}</li>
      </ul>
    </div>
  );
  return (
    <OnboardSlide header={header} content={content} image={onboardIconFive} imageSide="left" />
  );
};

export default WhySlide;
