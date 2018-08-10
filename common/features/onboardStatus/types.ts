export interface OnboardStatusState {
  sessionStarted: boolean;
  slideNumber: number;
}

export enum OnboardStatusActions {
  START_SESSION = 'ONBOARD_STATUS_START_SESSION',
  RESUME_SLIDE = 'ONBOARD_STATUS_RESUME_SLIDE',
  DECREMENT_SLIDE = 'ONBOARD_STATUS_DECREMENT_SLIDE',
  INCREMENT_SLIDE = 'ONBOARD_STATUS_INCREMENT_SLIDE'
}

export interface StartOnboardSessionAction {
  type: OnboardStatusActions.START_SESSION;
}

export interface ResumeSlideAction {
  type: OnboardStatusActions.RESUME_SLIDE;
  slideNumber: number;
}

export interface DecrementSlideAction {
  type: OnboardStatusActions.DECREMENT_SLIDE;
}

export interface IncrementSlideAction {
  type: OnboardStatusActions.INCREMENT_SLIDE;
}

export type OnboardStatusAction =
  | StartOnboardSessionAction
  | ResumeSlideAction
  | DecrementSlideAction
  | IncrementSlideAction;
