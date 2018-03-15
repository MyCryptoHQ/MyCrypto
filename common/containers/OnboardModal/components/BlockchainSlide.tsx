import React from 'react';
import translate from 'translations';
import OnboardSlide from './OnboardSlide';
import onboardIconFour from 'assets/images/onboarding/slide-04.svg';

const BlockchainSlide = () => {
  const header = translate('ONBOARD_BLOCKCHAIN_TITLE');
  const content = (
    <ul>
      <li>{translate('ONBOARD_BLOCKCHAIN_CONTENT__1', {}, true)}</li>
      <li>{translate('ONBOARD_BLOCKCHAIN_CONTENT__2', {}, true)}</li>
      <li>{translate('ONBOARD_BLOCKCHAIN_CONTENT__3', {}, true)}</li>
      <li>{translate('ONBOARD_BLOCKCHAIN_CONTENT__4', {}, true)}</li>
      <li>{translate('ONBOARD_BLOCKCHAIN_CONTENT__5', {}, true)}</li>
      <li>{translate('ONBOARD_BLOCKCHAIN_CONTENT__6', {}, true)}</li>
    </ul>
  );
  return (
    <OnboardSlide header={header} content={content} image={onboardIconFour} imageSide="right" />
  );
};
export default BlockchainSlide;
