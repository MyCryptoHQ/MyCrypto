import { TypeKeys } from 'actions/schedule';
import { SetCurrentScheduleTypeAction } from '../actionTypes/scheduleType';

export type TSetCurrentScheduleType = typeof setCurrentScheduleType;
export const setCurrentScheduleType = (
  payload: SetCurrentScheduleTypeAction['payload']
): SetCurrentScheduleTypeAction => ({
  type: TypeKeys.CURRENT_SCHEDULE_TYPE,
  payload
});
