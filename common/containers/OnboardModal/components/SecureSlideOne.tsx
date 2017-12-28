import React from 'react';
import translate from 'translations';
import OnboardSlide from './OnboardSlide';

const SecureSlideOne = () => {
  const header = (
    <div>
      <span>{translate('ONBOARD_secure_1_title')}</span>
      <p>{translate('ONBOARD_secure_1_content__1')}</p>
    </div>
  );

  const content = (
    <ul>
      <li>{translate('ONBOARD_secure_1_content__2')}</li>
      <li>{translate('ONBOARD_secure_1_content__3')} </li>
      <li>{translate('ONBOARD_secure_1_content__4')}</li>
      <li>{translate('ONBOARD_secure_1_content__5')}</li>
      <li>{translate('ONBOARD_secure_1_content__6')}</li>
      <li>{translate('ONBOARD_secure_1_content__7')}</li>
    </ul>
  );
  return <OnboardSlide header={header} content={content} />;
};
export default SecureSlideOne;
