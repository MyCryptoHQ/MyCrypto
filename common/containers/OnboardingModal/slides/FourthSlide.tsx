import React from 'react';

import translate, { translateRaw } from 'translations';
import trezor from 'assets/images/icn-trezor-new.svg';
import ledger from 'assets/images/icn-ledger-nano.svg';
import { HardwareWalletChoice, OnboardingButton } from '../components';
import './FourthSlide.scss';

export default function FourthSlide() {
  return (
    <section className="FourthSlide">
      <section className="FourthSlide-content">
        <h1 className="FourthSlide-content-heading">{translate('ONBOARDING_TEXT_25')}</h1>
        <p className="FourthSlide-content-text">{translate('ONBOARDING_TEXT_26')}</p>
        <section className="FourthSlide-content-wallets">
          <HardwareWalletChoice image={trezor} text={translateRaw('ONBOARDING_TEXT_27')} />
          <HardwareWalletChoice image={ledger} text={translateRaw('ONBOARDING_TEXT_28')} />
        </section>
        <p className="FourthSlide-content-text">
          {translate('ONBOARDING_TEXT_29', {
            $link: 'https://support.mycrypto.com/'
          })}
        </p>
        <OnboardingButton />
      </section>
    </section>
  );
}
