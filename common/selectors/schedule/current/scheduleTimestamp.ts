import { AppState } from 'reducers';
import { getScheduleTimestamp, getScheduleTimezone } from 'selectors/schedule';
import { dateTimeToTimezone, minFromNow } from 'selectors/schedule/helpers';

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

  return currentScheduleDatetime >= minFromNow(5);
};

const getCurrentScheduleTimestamp = (state: AppState): ICurrentScheduleTimestamp =>
  getScheduleTimestamp(state);

export { getCurrentScheduleTimestamp, ICurrentScheduleTimestamp, isValidCurrentScheduleTimestamp };
