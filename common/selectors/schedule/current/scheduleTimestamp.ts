import { AppState } from 'reducers';
import { getScheduleTimestamp, getScheduleTimezone } from 'selectors/schedule';
import { dateTimeToTimezone, minFromNow } from 'selectors/schedule/helpers';
import { EAC_SCHEDULING_CONFIG } from 'libs/scheduling';

interface ICurrentScheduleTimestamp {
  raw: string;
  value: Date;
}

const isValidCurrentScheduleTimestamp = (state: AppState) => {
  const currentScheduleTimestamp = getScheduleTimestamp(state);
  const currentScheduleTimezone = getScheduleTimezone(state);

  const currentScheduleDatetime = dateTimeToTimezone(
    currentScheduleTimestamp,
    currentScheduleTimezone.value
  );

  return (
    currentScheduleDatetime >= minFromNow(EAC_SCHEDULING_CONFIG.ALLOW_SCHEDULING_MIN_AFTER_NOW)
  );
};

const getCurrentScheduleTimestamp = (state: AppState): ICurrentScheduleTimestamp =>
  getScheduleTimestamp(state);

export { getCurrentScheduleTimestamp, ICurrentScheduleTimestamp, isValidCurrentScheduleTimestamp };
