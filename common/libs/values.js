// @flow
import Big from 'bignumber.js';
import { toWei } from 'libs/units';

export function stripHex(address: string): string {
  return address.replace('0x', '').toLowerCase();
}

export function valueToHex(n: Big | number | string): string {
  // Convert it to a Big to handle any and all values.
  const big = new Big(n);
  // Values are in ether, so convert to wei for RPC calls
  const wei = toWei(big, 'ether');
  // Finally, hex it up!
  return `0x${wei.toString(16)}`;
}
