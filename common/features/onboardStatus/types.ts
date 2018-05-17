export enum TypeKeys {
  START_ONBOARD_SESSION = 'START_ONBOARD_SESSION',
  RESUME_SLIDE = 'RESUME_SLIDE',
  DECREMENT_SLIDE = 'DECREMENT_SLIDE',
  INCREMENT_SLIDE = 'INCREMENT_SLIDE'
}

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
