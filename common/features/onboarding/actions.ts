import * as types from './types';

export type TCompleteOnboarding = typeof completeOnboarding;
export function completeOnboarding(): types.CompleteOnboardingAction {
  return {
    type: types.OnboardingActions.COMPLETE
  };
}

export type TSetOnboardingSlide = typeof setOnboardingSlide;
export function setOnboardingSlide(slideNumber: number): types.SetOnboardingSlideAction {
  return {
    type: types.OnboardingActions.SET_SLIDE,
    payload: slideNumber
  };
}
