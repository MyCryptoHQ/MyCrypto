import { AppState } from 'reducers';
import { getSchedulingToggle } from './fields';

interface ICurrentSchedulingToggle {
  raw: string;
  value: boolean;
}

const getCurrentSchedulingToggle = (state: AppState): ICurrentSchedulingToggle =>
  getSchedulingToggle(state);

export { getCurrentSchedulingToggle, ICurrentSchedulingToggle };
