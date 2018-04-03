import {
  SetCurrentScheduleTimestampAction,
  SetCurrentScheduleTimezoneAction
} from '../actionTypes/scheduleTimestamp';
import { TypeKeys } from 'actions/transaction';

export type TSetCurrentScheduleTimestamp = typeof setCurrentScheduleTimestamp;
export const setCurrentScheduleTimestamp = (
  payload: SetCurrentScheduleTimestampAction['payload']
): SetCurrentScheduleTimestampAction => ({
  type: TypeKeys.CURRENT_SCHEDULE_TIMESTAMP_SET,
  payload
});

export type TSetCurrentScheduleTimezone = typeof setCurrentScheduleTimezone;
export const setCurrentScheduleTimezone = (
  payload: SetCurrentScheduleTimezoneAction['payload']
): SetCurrentScheduleTimezoneAction => ({
  type: TypeKeys.CURRENT_SCHEDULE_TIMEZONE_SET,
  payload
});
