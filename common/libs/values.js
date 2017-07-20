// @flow
import type Big from 'big.js';

// FIXME does this even makes sense
export function toHex(n: Big): string {
  let reminder = n;
  let result = [];
  while (!reminder.eq(0)) {
    const mod = reminder.mod(16);
    reminder = reminder.div(16).round(0, 0);

    result.push(mod.toString());
  }
  return result.reverse().map(x => Number(x).toString(16)).join('');
}

export function stripHex(address: string): string {
  return address.replace('0x', '').toLowerCase();
}
