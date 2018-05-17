import {
  TypeKeys,
  StartOnboardSessionAction,
  ResumeSlideAction,
  DecrementSlideAction,
  IncrementSlideAction
} from './types';

export type TStartOnboardSession = typeof startOnboardSession;
export function startOnboardSession(): StartOnboardSessionAction {
  return {
    type: TypeKeys.START_ONBOARD_SESSION
  };
}

export type TResumeSlide = typeof resumeSlide;
export function resumeSlide(slideNumber: number): ResumeSlideAction {
  return {
    type: TypeKeys.RESUME_SLIDE,
    slideNumber
  };
}

export type TDecrementSlide = typeof decrementSlide;
export function decrementSlide(): DecrementSlideAction {
  return {
    type: TypeKeys.DECREMENT_SLIDE
  };
}

export type TIncrementSlide = typeof incrementSlide;
export function incrementSlide(): IncrementSlideAction {
  return {
    type: TypeKeys.INCREMENT_SLIDE
  };
}
