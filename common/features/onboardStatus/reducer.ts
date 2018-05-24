import { ONBOARD_STATUS, OnboardStatusAction, OnboardStatusState } from './types';

export const INITIAL_STATE: OnboardStatusState = {
  sessionStarted: false,
  slideNumber: 1
};

export function onboardStatusReducer(
  state: OnboardStatusState = INITIAL_STATE,
  action: OnboardStatusAction
): OnboardStatusState {
  switch (action.type) {
    case ONBOARD_STATUS.START_SESSION: {
      return {
        ...state,
        sessionStarted: true
      };
    }

    case ONBOARD_STATUS.RESUME_SLIDE: {
      return {
        ...state,
        slideNumber: action.slideNumber
      };
    }

    case ONBOARD_STATUS.DECREMENT_SLIDE: {
      const prevSlide = state.slideNumber - 1;

      return {
        ...state,
        slideNumber: prevSlide
      };
    }

    case ONBOARD_STATUS.INCREMENT_SLIDE: {
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
