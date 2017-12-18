import { OnboardStatusAction } from 'actions/onboardStatus';
import { TypeKeys } from 'actions/onboardStatus/constants';

export interface State {
  sessionStarted: boolean;
}

export const INITIAL_STATE: State = {
  sessionStarted: false
};

export function onboardStatus(state: State = INITIAL_STATE, action: OnboardStatusAction): State {
  switch (action.type) {
    case TypeKeys.START_ONBOARD_SESSION: {
      return {
        ...state,
        sessionStarted: true
      };
    }

    default:
      return state;
  }
}
