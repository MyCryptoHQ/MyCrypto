import * as onboardStatusTypes from './types';

export type TStartOnboardSession = typeof startOnboardSession;
export function startOnboardSession(): onboardStatusTypes.StartOnboardSessionAction {
  return {
    type: onboardStatusTypes.OnboardStatusActions.START_SESSION
  };
}

export type TResumeSlide = typeof resumeSlide;
export function resumeSlide(slideNumber: number): onboardStatusTypes.ResumeSlideAction {
  return {
    type: onboardStatusTypes.OnboardStatusActions.RESUME_SLIDE,
    slideNumber
  };
}

export type TDecrementSlide = typeof decrementSlide;
export function decrementSlide(): onboardStatusTypes.DecrementSlideAction {
  return {
    type: onboardStatusTypes.OnboardStatusActions.DECREMENT_SLIDE
  };
}

export type TIncrementSlide = typeof incrementSlide;
export function incrementSlide(): onboardStatusTypes.IncrementSlideAction {
  return {
    type: onboardStatusTypes.OnboardStatusActions.INCREMENT_SLIDE
  };
}
