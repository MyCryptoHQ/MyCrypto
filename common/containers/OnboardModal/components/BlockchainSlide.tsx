import React from 'react';
import translate, { translateMd } from 'translations';
import OnboardSlide from './OnboardSlide';
import onboardIconFour from 'assets/images/onboarding/slide-04.svg';

const BlockchainSlide = () => {
  const header = translate('ONBOARD_BLOCKCHAIN_TITLE');
  const content = (
    <ul>
      <li>{translateMd('ONBOARD_BLOCKCHAIN_CONTENT__1')}</li>
      <li>{translateMd('ONBOARD_BLOCKCHAIN_CONTENT__2')}</li>
      <li>{translateMd('ONBOARD_BLOCKCHAIN_CONTENT__3')}</li>
      <li>{translateMd('ONBOARD_BLOCKCHAIN_CONTENT__4')}</li>
      <li>{translateMd('ONBOARD_BLOCKCHAIN_CONTENT__5')}</li>
      <li>{translateMd('ONBOARD_BLOCKCHAIN_CONTENT__6')}</li>
    </ul>
  );
  return (
    <OnboardSlide header={header} content={content} image={onboardIconFour} imageSide="right" />
  );
};
export default BlockchainSlide;
