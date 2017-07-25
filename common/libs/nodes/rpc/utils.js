// @flow
// Ref: https://github.com/ethereum/wiki/wiki/JSON-RPC

import type Big from 'big.js';
import { toHex } from 'libs/values';
import { toBuffer } from 'ethereumjs-util';

// When encoding QUANTITIES (integers, numbers): encode as hex, prefix with "0x", the most compact representation (slight exception: zero should be represented as "0x0").
export function encodeQuantity(value: Big): string {
  return '0x' + (toHex(value) || '0');
}

// When encoding UNFORMATTED DATA (byte arrays, account addresses, hashes, bytecode arrays): encode as hex, prefix with "0x", two hex digits per byte.
export function encodeData(value: string | Buffer): string {
  return '0x' + toBuffer(value).toString('hex');
}
