import { AppState } from 'reducers';
import { getScheduleTimezone } from '../fields';

interface ICurrentScheduleTimezone {
  raw: string;
  value: string;
}

const getCurrentScheduleTimezone = (state: AppState): ICurrentScheduleTimezone =>
  getScheduleTimezone(state);

export { getCurrentScheduleTimezone, ICurrentScheduleTimezone };
