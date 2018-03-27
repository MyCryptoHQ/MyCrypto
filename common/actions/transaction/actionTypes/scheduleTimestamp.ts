import { TypeKeys } from '../constants';

/* user input */

interface SetCurrentScheduleTimestampAction {
  type: TypeKeys.CURRENT_SCHEDULE_TIMESTAMP_SET;
  payload: string;
}

type CurrentAction = SetCurrentScheduleTimestampAction;

export { SetCurrentScheduleTimestampAction, CurrentAction };
