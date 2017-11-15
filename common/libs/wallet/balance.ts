import { Wei } from 'libs/units';

export interface Balance {
  wei: Wei;
  isPending: boolean;
}
