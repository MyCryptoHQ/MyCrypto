import * as onboardStatusTypes from './types';

export const INITIAL_STATE: onboardStatusTypes.OnboardStatusState = {
  sessionStarted: false,
  slideNumber: 1
};

export function onboardStatusReducer(
  state: onboardStatusTypes.OnboardStatusState = INITIAL_STATE,
  action: onboardStatusTypes.OnboardStatusAction
): onboardStatusTypes.OnboardStatusState {
  switch (action.type) {
    case onboardStatusTypes.OnboardStatusActions.START_SESSION: {
      return {
        ...state,
        sessionStarted: true
      };
    }

    case onboardStatusTypes.OnboardStatusActions.RESUME_SLIDE: {
      return {
        ...state,
        slideNumber: action.slideNumber
      };
    }

    case onboardStatusTypes.OnboardStatusActions.DECREMENT_SLIDE: {
      const prevSlide = state.slideNumber - 1;

      return {
        ...state,
        slideNumber: prevSlide
      };
    }

    case onboardStatusTypes.OnboardStatusActions.INCREMENT_SLIDE: {
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
