import { currentWindowSize } from './currentWindowSize';
import { currentWindowStart } from './currentWindowStart';
import { currentScheduleTimestamp } from './currentScheduleTimestamp';
import { currentTimeBounty } from './currentTimeBounty';
import { currentSchedulingToggle } from './currentSchedulingToggle';

export const schedulingCurrentSagas = [
  currentWindowSize,
  currentWindowStart,
  currentScheduleTimestamp,
  currentTimeBounty,
  currentSchedulingToggle
];
