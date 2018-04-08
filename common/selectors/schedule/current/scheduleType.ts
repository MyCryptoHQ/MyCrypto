import { AppState } from 'reducers';
import { getScheduleType } from '../fields';

interface ICurrentScheduleType {
  raw: string;
  value: string | null;
}

const getCurrentScheduleType = (state: AppState): ICurrentScheduleType => getScheduleType(state);

export { getCurrentScheduleType, ICurrentScheduleType };
