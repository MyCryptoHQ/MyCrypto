import * as types from './types';

export type TToggleOnbardModal = typeof toggleOnboardModal;
export function toggleOnboardModal(): types.ToggleOnboardModalAction {
  return {
    type: types.OnboardStatusActions.TOGGLE_ONBOARD
  };
}
