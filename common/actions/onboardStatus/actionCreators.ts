import * as interfaces from './actionTypes';
import { TypeKeys } from './constants';

export type TStartOnboardSession = typeof startOnboardSession;
export function startOnboardSession(): interfaces.StartOnboardSessionAction {
  return {
    type: TypeKeys.START_ONBOARD_SESSION
  };
}

export type TResumeSlide = typeof resumeSlide;
export function resumeSlide(slideNumber: number): interfaces.ResumeSlideAction {
  return {
    type: TypeKeys.RESUME_SLIDE,
    slideNumber
  };
}

export type TDecrementSlide = typeof decrementSlide;
export function decrementSlide(): interfaces.DecrementSlideAction {
  return {
    type: TypeKeys.DECREMENT_SLIDE
  };
}

export type TIncrementSlide = typeof incrementSlide;
export function incrementSlide(): interfaces.IncrementSlideAction {
  return {
    type: TypeKeys.INCREMENT_SLIDE
  };
}
