import { Wei } from 'libs/units';

export interface Balance {
  wei: Wei | null;
  isPending: boolean;
}
