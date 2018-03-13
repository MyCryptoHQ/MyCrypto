import { currentTo } from './currentTo';
import { currentValue } from './currentValue';
import { currentWindowStart } from './currentWindowStart';

export const current = [currentTo, ...currentValue, currentWindowStart];
