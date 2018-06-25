import * as types from './types';

export const INITIAL_STATE: types.OnboardStatusState = {
  sessionStarted: false,
  slideNumber: 1
};

export function onboardStatusReducer(
  state: types.OnboardStatusState = INITIAL_STATE,
  action: types.OnboardStatusAction
): types.OnboardStatusState {
  switch (action.type) {
    case types.OnboardStatusActions.START_SESSION: {
      return {
        ...state,
        sessionStarted: true
      };
    }

    case types.OnboardStatusActions.RESUME_SLIDE: {
      return {
        ...state,
        slideNumber: action.slideNumber
      };
    }

    case types.OnboardStatusActions.DECREMENT_SLIDE: {
      const prevSlide = state.slideNumber - 1;

      return {
        ...state,
        slideNumber: prevSlide
      };
    }

    case types.OnboardStatusActions.INCREMENT_SLIDE: {
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
