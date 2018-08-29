export type slideNumber = 1 | 2 | 3 | 4;

export interface OnboardingState {
  active: boolean;
  slide: number;
}

export enum OnboardingActions {
  COMPLETE = 'ONBOARDING_COMPLETE',
  SET_SLIDE = 'ONBOARDING_SET_SLIDE'
}

export interface CompleteOnboardingAction {
  type: OnboardingActions.COMPLETE;
}

export interface SetOnboardingSlideAction {
  type: OnboardingActions.SET_SLIDE;
  payload: slideNumber;
}

export type OnboardingAction = CompleteOnboardingAction | SetOnboardingSlideAction;
