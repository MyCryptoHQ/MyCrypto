import { AppState } from 'reducers';
import { getScheduleTimestamp } from './fields';
import moment from 'moment';
import { EAC_SCHEDULING_CONFIG } from 'libs/scheduling';

const fiveMinFromNow = moment()
  .add(5, 'm')
  .toDate();

interface ICurrentScheduleTimestamp {
  raw: string;
  value: Date | null;
}

const isValidCurrentScheduleTimestamp = (state: AppState) => {
  const currentScheduleTimestamp = getScheduleTimestamp(state);
  const raw = currentScheduleTimestamp.raw;
  const value = currentScheduleTimestamp.value;

  return value && value > fiveMinFromNow && isCorrectFormat(raw);
};

const isCorrectFormat = (dateString: string) => {
  return moment(dateString, EAC_SCHEDULING_CONFIG.SCHEDULE_TIMESTAMP_FORMAT, true).isValid();
};

const getCurrentScheduleTimestamp = (state: AppState): ICurrentScheduleTimestamp =>
  getScheduleTimestamp(state);

export {
  getCurrentScheduleTimestamp,
  ICurrentScheduleTimestamp,
  isValidCurrentScheduleTimestamp,
  fiveMinFromNow
};
