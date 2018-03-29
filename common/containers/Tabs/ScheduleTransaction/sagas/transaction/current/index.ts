import { currentWindowStart } from './currentWindowStart';
import { currentScheduleTimestamp } from './currentScheduleTimestamp';
import { currentTimeBounty } from './currentTimeBounty';

export const schedulingCurrentSagas = [
  currentWindowStart,
  currentScheduleTimestamp,
  currentTimeBounty
];
