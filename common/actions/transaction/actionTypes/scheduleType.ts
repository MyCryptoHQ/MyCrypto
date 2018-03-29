import { TypeKeys } from '../constants';

/* user input */

interface SetCurrentScheduleTypeAction {
  type: TypeKeys.CURRENT_SCHEDULE_TYPE;
  payload: string;
}

type CurrentAction = SetCurrentScheduleTypeAction;

export { SetCurrentScheduleTypeAction, CurrentAction };
