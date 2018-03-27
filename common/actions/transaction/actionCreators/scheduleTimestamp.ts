import {
  SetCurrentScheduleTimestampAction,
  SetScheduleTimezoneAction
} from '../actionTypes/scheduleTimestamp';
import { TypeKeys } from '../';

export type TSetCurrentScheduleTimestamp = typeof setCurrentScheduleTimestamp;
export const setCurrentScheduleTimestamp = (
  payload: SetCurrentScheduleTimestampAction['payload']
): SetCurrentScheduleTimestampAction => ({
  type: TypeKeys.CURRENT_SCHEDULE_TIMESTAMP_SET,
  payload
});

export type TSetScheduleTimezone = typeof setScheduleTimezone;
export const setScheduleTimezone = (
  payload: SetScheduleTimezoneAction['payload']
): SetScheduleTimezoneAction => ({
  type: TypeKeys.SCHEDULE_TIMEZONE_SET,
  payload
});
