import { TypeKeys } from './constants';

export interface StartOnboardSessionAction {
  type: TypeKeys.START_ONBOARD_SESSION;
}

export interface ResumeSlideAction {
  type: TypeKeys.RESUME_SLIDE;
  slideNumber: number;
}

export interface DecrementSlideAction {
  type: TypeKeys.DECREMENT_SLIDE;
}

export interface IncrementSlideAction {
  type: TypeKeys.INCREMENT_SLIDE;
}

export type OnboardStatusAction =
  | StartOnboardSessionAction
  | ResumeSlideAction
  | DecrementSlideAction
  | IncrementSlideAction;
