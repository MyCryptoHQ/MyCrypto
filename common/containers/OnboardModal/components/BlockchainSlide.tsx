import React from 'react';
import translate from 'translations';
import OnboardSlide from './OnboardSlide';
import onboardIconFour from 'assets/images/onboarding_icon-04.svg';

const BlockchainSlide = () => {
  const header = translate('ONBOARD_blockchain_title');
  const content = (
    <ul>
      <li>{translate('ONBOARD_blockchain_content__1')}</li>
      <li>{translate('ONBOARD_blockchain_content__2')}</li>
      <li>{translate('ONBOARD_blockchain_content__3')}</li>
      <li>{translate('ONBOARD_blockchain_content__4')}</li>
      <li>{translate('ONBOARD_blockchain_content__5')}</li>
      <li>{translate('ONBOARD_blockchain_content__6')}</li>
    </ul>
  );
  return (
    <OnboardSlide header={header} content={content} image={onboardIconFour} imageSide="right" />
  );
};
export default BlockchainSlide;
