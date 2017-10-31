import { Ether } from 'libs/units';

export interface NetworkStatus {
  isPending: boolean;
}
export interface Balance extends Ether, NetworkStatus {}
