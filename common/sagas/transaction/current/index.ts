import { currentTo } from './currentTo';
import { currentValue } from './currentValue';
import { schedulingCurrentSagas } from 'containers/Tabs/ScheduleTransaction/sagas/transaction/current';

export const current = [currentTo, ...currentValue, ...schedulingCurrentSagas];
