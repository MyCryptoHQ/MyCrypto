export interface OnboardStatusState {
  sessionStarted: boolean;
  slideNumber: number;
}

export enum ONBOARD_STATUS {
  START_SESSION = 'ONBOARD_STATUS_START_SESSION',
  RESUME_SLIDE = 'ONBOARD_STATUS_RESUME_SLIDE',
  DECREMENT_SLIDE = 'ONBOARD_STATUS_DECREMENT_SLIDE',
  INCREMENT_SLIDE = 'ONBOARD_STATUS_INCREMENT_SLIDE'
}

export interface StartOnboardSessionAction {
  type: ONBOARD_STATUS.START_SESSION;
}

export interface ResumeSlideAction {
  type: ONBOARD_STATUS.RESUME_SLIDE;
  slideNumber: number;
}

export interface DecrementSlideAction {
  type: ONBOARD_STATUS.DECREMENT_SLIDE;
}

export interface IncrementSlideAction {
  type: ONBOARD_STATUS.INCREMENT_SLIDE;
}

export type OnboardStatusAction =
  | StartOnboardSessionAction
  | ResumeSlideAction
  | DecrementSlideAction
  | IncrementSlideAction;
