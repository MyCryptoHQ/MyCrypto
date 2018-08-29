import React from 'react';

import { OnboardingButton } from '../components';
import './FirstSlide.scss';

export default function FirstSlide() {
  return (
    <section className="FirstSlide">
      <section className="FirstSlide-content">
        <h1 className="FirstSlide-content-heading">Welcome to MyCrypto.com</h1>
        <p className="FirstSlide-content-text">
          Please read the next few screens for your own safety. <br />
          Your funds could be stolen if you do not pay attention to these warnings.
        </p>
        <OnboardingButton />
      </section>
    </section>
  );
}
