import { SetCurrentScheduleTypeAction } from '../actionTypes/scheduleType';
import { TypeKeys } from 'actions/transaction';

export type TSetCurrentScheduleType = typeof setCurrentScheduleType;
export const setCurrentScheduleType = (
  payload: SetCurrentScheduleTypeAction['payload']
): SetCurrentScheduleTypeAction => ({
  type: TypeKeys.CURRENT_SCHEDULE_TYPE,
  payload
});
