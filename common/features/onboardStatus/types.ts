export interface OnboardStatusState {
  open: boolean;
}

export enum OnboardStatusActions {
  TOGGLE_ONBOARD = 'TOGGLE_ONBOARD'
}

export interface ToggleOnboardModalAction {
  type: OnboardStatusActions.TOGGLE_ONBOARD;
}

export type OnboardStatusAction = ToggleOnboardModalAction;
