import React from 'react';
import { connect } from 'react-redux';

import { AppState } from 'features/reducers';
import { onboardingActions, onboardingSelectors } from 'features/onboarding';
import './ProgressDots.scss';

interface StateProps {
  currentStep: ReturnType<typeof onboardingSelectors.getSlide>;
}

interface DispatchProps {
  setSlide: onboardingActions.TSetOnboardingSlide;
}

type Props = StateProps & DispatchProps;

function ProgressDots({ currentStep, setSlide }: Props) {
  const dots = new Array(4).fill('ProgressDots-dot');

  // Replace the active page with a different dot.
  dots[currentStep - 1] = 'ProgressDots-dot ProgressDots-dot--active';

  return (
    <section className="ProgressDots">
      {dots.map((dot, index) => (
        <div key={index} className={dot} onClick={() => setSlide(index + 1)} />
      ))}
    </section>
  );
}

export default connect(
  (state: AppState) => ({
    currentStep: onboardingSelectors.getSlide(state)
  }),
  {
    setSlide: onboardingActions.setOnboardingSlide
  }
)(ProgressDots);
