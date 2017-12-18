import { TypeKeys } from './constants';

export interface StartOnboardSessionAction {
  type: TypeKeys.START_ONBOARD_SESSION;
}

export type OnboardStatusAction = StartOnboardSessionAction;
