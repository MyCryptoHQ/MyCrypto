import React from 'react';

import translate from 'translations';
import { OnboardingButton } from '../components';
import './FirstSlide.scss';

export default function FirstSlide() {
  return (
    <section className="FirstSlide">
      <h1 className="FirstSlide-content-heading">{translate('ONBOARDING_TEXT_1')}</h1>
      <p className="FirstSlide-content-text">{translate('ONBOARDING_TEXT_2')}</p>
      <OnboardingButton />
    </section>
  );
}
