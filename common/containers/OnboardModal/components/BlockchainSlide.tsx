import React from 'react';
import { translateRaw, translateMarkdown } from 'translations';
import OnboardSlide from './OnboardSlide';
import onboardIconFour from 'assets/images/onboarding/slide-04.svg';

const BlockchainSlide = () => {
  const header = translateRaw('ONBOARD_blockchain_title');
  const content = (
    <ul>
      <li>{translateMarkdown('ONBOARD_blockchain_content__1')}</li>
      <li>{translateMarkdown('ONBOARD_blockchain_content__2')}</li>
      <li>{translateMarkdown('ONBOARD_blockchain_content__3')}</li>
      <li>{translateMarkdown('ONBOARD_blockchain_content__4')}</li>
      <li>{translateMarkdown('ONBOARD_blockchain_content__5')}</li>
      <li>{translateMarkdown('ONBOARD_blockchain_content__6')}</li>
    </ul>
  );
  return (
    <OnboardSlide header={header} content={content} image={onboardIconFour} imageSide="right" />
  );
};
export default BlockchainSlide;
