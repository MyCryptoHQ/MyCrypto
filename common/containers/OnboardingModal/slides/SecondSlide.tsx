import React from 'react';

import translate from 'translations';
import { OnboardingButton } from '../components';
import './SecondSlide.scss';

export default function SecondSlide() {
  return (
    <section className="SecondSlide">
      <section>
        <h1>{translate('ONBOARDING_TEXT_3')}</h1>
        <ul>
          <li>{translate('ONBOARDING_TEXT_4')}</li>
          <li>{translate('ONBOARDING_TEXT_5')}</li>
          <li>{translate('ONBOARDING_TEXT_6')}</li>
          <li>{translate('ONBOARDING_TEXT_7')}</li>
        </ul>
        <OnboardingButton className="horizontal" />
      </section>
      <section>
        <h1>{translate('ONBOARDING_TEXT_8')}</h1>
        <ul>
          <li>{translate('ONBOARDING_TEXT_9')}</li>
          <li>{translate('ONBOARDING_TEXT_10')}</li>
          <li>{translate('ONBOARDING_TEXT_11')}</li>
          <li>{translate('ONBOARDING_TEXT_12')}</li>
        </ul>
      </section>
      <OnboardingButton className="vertical" />
    </section>
  );
}
