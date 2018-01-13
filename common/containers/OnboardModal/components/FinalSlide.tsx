import React from 'react';
import translate from 'translations';
import { Link } from 'react-router-dom';
import OnboardSlide from './OnboardSlide';
import onboardIconTen from 'assets/images/onboarding_icon-10.svg';

const FinalSlide = ({ closeModal }) => {
  const header = translate('ONBOARD_final_title');
  const subheader = translate('ONBOARD_final_subtitle');

  const content = (
    <ul>
      <li>
        <a
          href="https://myetherwallet.github.io/knowledge-base/hardware-wallets/hardware-wallet-recommendations.html"
          target="_blank"
          rel="noopener noreferrer"
          className="strong"
        >
          {translate('ONBOARD_final_content__2')}
        </a>
      </li>
      <li>
        <a
          href="https://myetherwallet.github.io/knowledge-base/migration/moving-from-private-key-to-metamask.html"
          target="_blank"
          rel="noopener noreferrer"
          className="strong"
        >
          {translate('ONBOARD_final_content__3')}
        </a>
      </li>
      <li>
        <a
          href="https://myetherwallet.github.io/knowledge-base/offline/running-myetherwallet-locally.html"
          target="_blank"
          rel="noopener noreferrer"
          className="strong"
        >
          {translate('ONBOARD_final_content__4')}
        </a>
      </li>
      <li>
        <a
          href="https://myetherwallet.github.io/knowledge-base/migration/moving-from-private-key-to-ledger-hardware-wallet.html"
          target="_blank"
          rel="noopener noreferrer"
          className="strong"
        >
          {translate('ONBOARD_final_content__5')}
        </a>
      </li>
      <li>
        <a
          href="https://myetherwallet.github.io/knowledge-base/hardware-wallets/trezor-sending-to-trezor-device.html"
          target="_blank"
          rel="noopener noreferrer"
          className="strong"
        >
          {translate('ONBOARD_final_content__6')}
        </a>
      </li>
      <li>
        <a
          href="https://myetherwallet.github.io/knowledge-base/migration/moving-from-private-key-to-metamask.html"
          target="_blank"
          rel="noopener noreferrer"
          className="strong"
        >
          {translate('ONBOARD_final_content__7')}
        </a>
      </li>
      <li>
        <a
          href="https://myetherwallet.github.io/knowledge-base/"
          target="_blank"
          rel="noopener noreferrer"
          className="strong"
        >
          {translate('ONBOARD_final_content__8')}
        </a>
      </li>
      <li>
        <Link onClick={closeModal} to="/send-transaction" className="strong">
          <span> {translate('ONBOARD_final_content__9')}</span>
        </Link>
      </li>
    </ul>
  );
  return (
    <OnboardSlide
      header={header}
      subheader={subheader}
      content={content}
      image={onboardIconTen}
      imageSide="left"
    />
  );
};
export default FinalSlide;
