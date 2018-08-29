import React from 'react';

import { OnboardingButton } from '../components';
import './SecondSlide.scss';

export default function SecondSlide() {
  return (
    <section className="SecondSlide">
      <section className="SecondSlide-content">
        <section className="SecondSlide-content-segment">
          <h1 className="SecondSlide-content-heading">With Banks...</h1>
          <p className="SecondSlide-content-text">
            They control your account <br />
            They own your info <br />
            They add fees <br />
            They tell you what you can do <br />
          </p>
          <OnboardingButton className="horizontal" />
        </section>
        <section className="SecondSlide-content-segment">
          <h1 className="SecondSlide-content-heading">With MyCrypto...</h1>
          <p className="SecondSlide-content-text">
            You control your ”account” <br />
            You own your info <br />
            No fees are added <br />
            You do whatever you want <br />
          </p>
        </section>
        <OnboardingButton className="vertical" />
      </section>
    </section>
  );
}
