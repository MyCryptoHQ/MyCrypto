import { currentTo } from './currentTo';
import { currentValue } from './currentValue';
import { currentWindowStart } from './currentWindowStart';
import { currentScheduleTimestamp } from './currentScheduleTimestamp';

export const current = [currentTo, ...currentValue, currentWindowStart, currentScheduleTimestamp];
