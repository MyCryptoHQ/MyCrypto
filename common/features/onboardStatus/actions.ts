import {
  ONBOARD_STATUS,
  StartOnboardSessionAction,
  ResumeSlideAction,
  DecrementSlideAction,
  IncrementSlideAction
} from './types';

export type TStartOnboardSession = typeof startOnboardSession;
export function startOnboardSession(): StartOnboardSessionAction {
  return {
    type: ONBOARD_STATUS.START_SESSION
  };
}

export type TResumeSlide = typeof resumeSlide;
export function resumeSlide(slideNumber: number): ResumeSlideAction {
  return {
    type: ONBOARD_STATUS.RESUME_SLIDE,
    slideNumber
  };
}

export type TDecrementSlide = typeof decrementSlide;
export function decrementSlide(): DecrementSlideAction {
  return {
    type: ONBOARD_STATUS.DECREMENT_SLIDE
  };
}

export type TIncrementSlide = typeof incrementSlide;
export function incrementSlide(): IncrementSlideAction {
  return {
    type: ONBOARD_STATUS.INCREMENT_SLIDE
  };
}
