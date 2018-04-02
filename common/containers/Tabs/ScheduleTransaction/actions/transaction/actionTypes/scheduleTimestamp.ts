import { TypeKeys } from 'actions/transaction';

/* user input */

interface SetCurrentScheduleTimestampAction {
  type: TypeKeys.CURRENT_SCHEDULE_TIMESTAMP_SET;
  payload: string;
}

type CurrentAction = SetCurrentScheduleTimestampAction;

interface SetScheduleTimezoneAction {
  type: TypeKeys.SCHEDULE_TIMEZONE_SET;
  payload: string;
}

export { SetCurrentScheduleTimestampAction, CurrentAction, SetScheduleTimezoneAction };
