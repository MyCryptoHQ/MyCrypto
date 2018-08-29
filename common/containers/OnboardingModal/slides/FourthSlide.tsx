import React from 'react';

import trezor from 'assets/images/icn-trezor-new.svg';
import ledger from 'assets/images/icn-ledger-nano.svg';
import { HardwareWalletChoice, OnboardingButton } from '../components';
import './FourthSlide.scss';

export default function FourthSlide() {
  return (
    <section className="FourthSlide">
      <section className="FourthSlide-content">
        <h1 className="FourthSlide-content-heading">You're ready to get started!</h1>
        <p className="FourthSlide-content-text">
          Pro-Tip: in order for your funds to be the most secure, we recommend getting a hardware
          wallet to use with MyCrypto. Here are a few options we love:
        </p>
        <section className="FourthSlide-content-wallets">
          <HardwareWalletChoice image={trezor} text="Get a Trezor" />
          <HardwareWalletChoice image={ledger} text="Get a Ledger" />
        </section>
        <p className="FourthSlide-content-text">
          Need more info before you dive in? See Support Center
        </p>
        <OnboardingButton />
      </section>
    </section>
  );
}
