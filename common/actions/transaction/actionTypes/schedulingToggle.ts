import { TypeKeys } from '../constants';

/* user input */

interface SetCurrentSchedulingToggleAction {
  type: TypeKeys.CURRENT_SCHEDULING_TOGGLE;
  payload: string;
}

type CurrentAction = SetCurrentSchedulingToggleAction;

export { SetCurrentSchedulingToggleAction, CurrentAction };
