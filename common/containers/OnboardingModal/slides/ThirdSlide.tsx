import React from 'react';

import { OnboardingButton } from '../components';
import './ThirdSlide.scss';

export default function ThirdSlide() {
  return (
    <section className="ThirdSlide">
      <section className="ThirdSlide-content">
        <section>
          <h1 className="ThirdSlide-content-heading">Please understand that we can't...</h1>
          <ul className="ThirdSlide-content-text">
            <li>Access your funds for you</li>
            <li>Recover, reset, or modify ANY of your information</li>
            <li>Reverse, cancel, or refund transactions</li>
            <li>Freeze accounts</li>
          </ul>
        </section>
        <section>
          <section>
            <h1 className="ThirdSlide-content-heading">You're responsible for...</h1>
            <ul className="ThirdSlide-content-text">
              <li>
                Keeping your information safe. This includes:
                <ul>
                  <li>Private Keys/Mnemonic Phrases</li>
                  <li>JSON files</li>
                  <li>Hardware wallet PINs</li>
                </ul>
              </li>
              <li>Making sure you're not on a phishing site</li>
              <li>Reducing risk by using the MyCrypto downloadable app</li>
            </ul>
          </section>
          <OnboardingButton />
        </section>
      </section>
    </section>
  );
}
