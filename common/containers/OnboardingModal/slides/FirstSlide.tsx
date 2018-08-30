import React from 'react';

import translate from 'translations';
import { OnboardingButton } from '../components';

export default function FirstSlide() {
  return (
    <section className="FirstSlide">
      <h1>{translate('ONBOARDING_TEXT_1')}</h1>
      <p>{translate('ONBOARDING_TEXT_2')}</p>
      <OnboardingButton />
    </section>
  );
}
