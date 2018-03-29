import { currentWindowSize } from './currentWindowSize';
import { currentWindowStart } from './currentWindowStart';
import { currentScheduleTimestamp } from './currentScheduleTimestamp';
import { currentTimeBounty } from './currentTimeBounty';

export const schedulingCurrentSagas = [
  currentWindowSize,
  currentWindowStart,
  currentScheduleTimestamp,
  currentTimeBounty
];
