import * as types from './types';

export const INITIAL_STATE: types.OnboardStatusState = {
  open: true
};

export function onboardStatusReducer(
  state: types.OnboardStatusState = INITIAL_STATE,
  action: types.OnboardStatusAction
): types.OnboardStatusState {
  switch (action.type) {
    case types.OnboardStatusActions.TOGGLE_ONBOARD: {
      return { open: !state.open };
    }

    default:
      return state;
  }
}
