import React from 'react';

import translate from 'translations';
import { OnboardingButton } from '../components';

export default function ThirdSlide() {
  return (
    <section className="ThirdSlide">
      <section>
        <h1>{translate('ONBOARDING_TEXT_13')}</h1>
        <ul>
          <li>{translate('ONBOARDING_TEXT_14')}</li>
          <li>{translate('ONBOARDING_TEXT_15')}</li>
          <li>{translate('ONBOARDING_TEXT_16')}</li>
          <li>{translate('ONBOARDING_TEXT_17')}</li>
        </ul>
      </section>
      <section>
        <section>
          <h1>{translate('ONBOARDING_TEXT_18')}</h1>
          <ul>
            <li>
              {translate('ONBOARDING_TEXT_19')}
              <ul>
                <li>{translate('ONBOARDING_TEXT_20')}</li>
                <li>{translate('ONBOARDING_TEXT_21')}</li>
                <li>{translate('ONBOARDING_TEXT_22')}</li>
              </ul>
            </li>
            <li>
              {translate('ONBOARDING_TEXT_23', {
                $link: 'https://etherscamdb.info/'
              })}
            </li>
            <li>
              {translate('ONBOARDING_TEXT_24', {
                $link: 'https://download.mycrypto.com/'
              })}
            </li>
          </ul>
        </section>
        <OnboardingButton />
      </section>
    </section>
  );
}
