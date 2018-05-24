import { TypeKeys } from 'actions/schedule';

/* user input */

interface SetCurrentScheduleTimestampAction {
  type: TypeKeys.CURRENT_SCHEDULE_TIMESTAMP_SET;
  payload: string;
}

type CurrentAction = SetCurrentScheduleTimestampAction;

interface SetCurrentScheduleTimezoneAction {
  type: TypeKeys.CURRENT_SCHEDULE_TIMEZONE_SET;
  payload: string;
}

export { SetCurrentScheduleTimestampAction, CurrentAction, SetCurrentScheduleTimezoneAction };
