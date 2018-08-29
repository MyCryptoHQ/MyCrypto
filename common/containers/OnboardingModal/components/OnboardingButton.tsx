import React from 'react';
import { connect } from 'react-redux';

import { AppState } from 'features/reducers';
import { onboardingActions, onboardingSelectors } from 'features/onboarding';
import './OnboardingButton.scss';

interface OwnProps {
  className?: string;
}

interface StateProps {
  currentSlide: ReturnType<typeof onboardingSelectors.getSlide>;
}

interface DispatchProps {
  completeOnboarding: onboardingActions.TCompleteOnboarding;
  setSlide: onboardingActions.TSetOnboardingSlide;
}

type Props = OwnProps & StateProps & DispatchProps;

function OnboardingButton({ className = '', currentSlide, completeOnboarding, setSlide }: Props) {
  const fullClassName = `OnboardingButton ${className}`;
  const nextSlide = currentSlide + 1;
  const isOnFinalSlide = nextSlide > 4;
  const changeSlide = () => setSlide(nextSlide);
  const onClick = isOnFinalSlide ? completeOnboarding : changeSlide;
  const text = isOnFinalSlide ? 'Get Started' : 'Next';

  return (
    <button className={fullClassName} onClick={onClick}>
      {text}
    </button>
  );
}

export default connect(
  (state: AppState) => ({
    currentSlide: onboardingSelectors.getSlide(state)
  }),
  {
    completeOnboarding: onboardingActions.completeOnboarding,
    setSlide: onboardingActions.setOnboardingSlide
  }
)(OnboardingButton);
