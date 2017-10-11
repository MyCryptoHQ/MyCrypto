import { Ether } from 'libs/units';

export function stripHexPrefix(value: string) {
  return value.replace('0x', '');
}

export function stripHexPrefixAndLower(value: string): string {
  return stripHexPrefix(value).toLowerCase();
}

export function valueToHex(value: Ether): string {
  // Values are in ether, so convert to wei for RPC calls
  const wei = value.toWei();
  // Finally, hex it up!
  return `0x${wei.toString(16)}`;
}
