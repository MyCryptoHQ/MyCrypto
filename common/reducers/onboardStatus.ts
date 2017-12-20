import { OnboardStatusAction } from 'actions/onboardStatus';
import { TypeKeys } from 'actions/onboardStatus/constants';

export interface State {
  sessionStarted: boolean;
  slideNumber: number;
}

export const INITIAL_STATE: State = {
  sessionStarted: false,
  slideNumber: 1
};

export function onboardStatus(state: State = INITIAL_STATE, action: OnboardStatusAction): State {
  switch (action.type) {
    case TypeKeys.START_ONBOARD_SESSION: {
      return {
        ...state,
        sessionStarted: true
      };
    }

    case TypeKeys.RESUME_SLIDE: {
      return {
        ...state,
        slideNumber: action.slideNumber
      };
    }

    case TypeKeys.DECREMENT_SLIDE: {
      const prevSlide = state.slideNumber - 1;

      return {
        ...state,
        slideNumber: prevSlide
      };
    }

    case TypeKeys.INCREMENT_SLIDE: {
      const nextSlide = state.slideNumber + 1;

      return {
        ...state,
        slideNumber: nextSlide
      };
    }

    default:
      return state;
  }
}
