// @flow
import { Ether } from 'libs/units';

export function stripHex(address: string): string {
  return address.replace('0x', '').toLowerCase();
}

export function valueToHex(value: Ether): string {
  // Values are in ether, so convert to wei for RPC calls
  const wei = value.toWei();
  // Finally, hex it up!
  return `0x${wei.toString(16)}`;
}
