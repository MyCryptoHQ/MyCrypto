import { SetCurrentScheduleTimestampAction } from '../actionTypes/scheduleTimestamp';
import { TypeKeys } from '../';

type TSetCurrentScheduleTimestamp = typeof setCurrentScheduleTimestamp;
const setCurrentScheduleTimestamp = (
  payload: SetCurrentScheduleTimestampAction['payload']
): SetCurrentScheduleTimestampAction => ({
  type: TypeKeys.CURRENT_SCHEDULE_TIMESTAMP_SET,
  payload
});

export { setCurrentScheduleTimestamp, TSetCurrentScheduleTimestamp };
