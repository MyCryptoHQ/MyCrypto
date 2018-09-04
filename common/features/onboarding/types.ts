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
  payload: number;
}

export type OnboardingAction = CompleteOnboardingAction | SetOnboardingSlideAction;
