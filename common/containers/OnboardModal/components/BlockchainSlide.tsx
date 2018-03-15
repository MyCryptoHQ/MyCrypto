import React from 'react';
import translate from 'translations';
import OnboardSlide from './OnboardSlide';
import onboardIconFour from 'assets/images/onboarding/slide-04.svg';

const BlockchainSlide = () => {
  const header = translate('ONBOARD_blockchain_title');
  const content = (
    <ul>
      <li>{translate('ONBOARD_blockchain_content__1', {}, true)}</li>
      <li>{translate('ONBOARD_blockchain_content__2', {}, true)}</li>
      <li>{translate('ONBOARD_blockchain_content__3', {}, true)}</li>
      <li>{translate('ONBOARD_blockchain_content__4', {}, true)}</li>
      <li>{translate('ONBOARD_blockchain_content__5', {}, true)}</li>
      <li>{translate('ONBOARD_blockchain_content__6', {}, true)}</li>
    </ul>
  );
  return (
    <OnboardSlide header={header} content={content} image={onboardIconFour} imageSide="right" />
  );
};
export default BlockchainSlide;
