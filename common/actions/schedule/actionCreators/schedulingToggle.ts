import { SetCurrentSchedulingToggleAction } from '../actionTypes/schedulingToggle';
import { TypeKeys } from 'actions/schedule';

type TSetCurrentSchedulingToggle = typeof setCurrentSchedulingToggle;
const setCurrentSchedulingToggle = (
  payload: SetCurrentSchedulingToggleAction['payload']
): SetCurrentSchedulingToggleAction => ({
  type: TypeKeys.CURRENT_SCHEDULING_TOGGLE,
  payload
});

export { TSetCurrentSchedulingToggle, setCurrentSchedulingToggle };
