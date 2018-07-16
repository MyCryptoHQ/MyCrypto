import React from 'react';

import translate from 'translations';
import onboardIconFour from 'assets/images/onboarding/slide-04.svg';
import OnboardSlide from './OnboardSlide';

const BlockchainSlide = () => {
  const header = translate('ONBOARD_BLOCKCHAIN_TITLE');
  const content = (
    <ul>
      <li>{translate('ONBOARD_BLOCKCHAIN_CONTENT__1')}</li>
      <li>{translate('ONBOARD_BLOCKCHAIN_CONTENT__2')}</li>
      <li>{translate('ONBOARD_BLOCKCHAIN_CONTENT__3')}</li>
      <li>{translate('ONBOARD_BLOCKCHAIN_CONTENT__4')}</li>
      <li>{translate('ONBOARD_BLOCKCHAIN_CONTENT__5')}</li>
      <li>{translate('ONBOARD_BLOCKCHAIN_CONTENT__6')}</li>
    </ul>
  );
  return (
    <OnboardSlide header={header} content={content} image={onboardIconFour} imageSide="right" />
  );
};
export default BlockchainSlide;
