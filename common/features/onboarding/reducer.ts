import * as types from './types';

export const INITIAL_STATE: types.OnboardingState = {
  active: true,
  slide: 1
};

export function onboardingReducer(
  state: types.OnboardingState = INITIAL_STATE,
  action: types.OnboardingAction
): types.OnboardingState {
  switch (action.type) {
    case types.OnboardingActions.COMPLETE:
      return {
        ...state,
        active: false
      };
    case types.OnboardingActions.SET_SLIDE:
      return {
        ...state,
        slide: action.payload
      };
    default:
      return state;
  }
}
