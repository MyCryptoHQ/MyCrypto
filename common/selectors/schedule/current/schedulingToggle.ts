import { AppState } from 'reducers';
import { getSchedulingToggle } from '../fields';

interface ICurrentSchedulingToggle {
  value: boolean;
}

const getCurrentSchedulingToggle = (state: AppState): ICurrentSchedulingToggle =>
  getSchedulingToggle(state);

export { getCurrentSchedulingToggle, ICurrentSchedulingToggle };
