import React from 'react';

import translate from 'translations';
import { OnboardingButton } from '../components';
import './SecondSlide.scss';

export default function SecondSlide() {
  return (
    <section className="SecondSlide">
      <section>
        <h1>{translate('ONBOARDING_TEXT_3')}</h1>
        <p>
          {translate('ONBOARDING_TEXT_4')} <br />
          {translate('ONBOARDING_TEXT_5')} <br />
          {translate('ONBOARDING_TEXT_6')} <br />
          {translate('ONBOARDING_TEXT_7')} <br />
        </p>
        <OnboardingButton className="horizontal" />
      </section>
      <section>
        <h1>{translate('ONBOARDING_TEXT_8')}</h1>
        <p>
          {translate('ONBOARDING_TEXT_9')} <br />
          {translate('ONBOARDING_TEXT_10')} <br />
          {translate('ONBOARDING_TEXT_11')} <br />
          {translate('ONBOARDING_TEXT_12')} <br />
        </p>
      </section>
      <OnboardingButton className="vertical" />
    </section>
  );
}
