import * as types from './types';

export type TStartOnboardSession = typeof startOnboardSession;
export function startOnboardSession(): types.StartOnboardSessionAction {
  return {
    type: types.OnboardStatusActions.START_SESSION
  };
}

export type TResumeSlide = typeof resumeSlide;
export function resumeSlide(slideNumber: number): types.ResumeSlideAction {
  return {
    type: types.OnboardStatusActions.RESUME_SLIDE,
    slideNumber
  };
}

export type TDecrementSlide = typeof decrementSlide;
export function decrementSlide(): types.DecrementSlideAction {
  return {
    type: types.OnboardStatusActions.DECREMENT_SLIDE
  };
}

export type TIncrementSlide = typeof incrementSlide;
export function incrementSlide(): types.IncrementSlideAction {
  return {
    type: types.OnboardStatusActions.INCREMENT_SLIDE
  };
}
