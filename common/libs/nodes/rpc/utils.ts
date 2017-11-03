// Ref: https://github.com/ethereum/wiki/wiki/JSON-RPC

import BN from 'bn.js';
import { toBuffer } from 'ethereumjs-util';

// When encoding QUANTITIES (integers, numbers): encode as hex, prefix with "0x", the most compact representation (slight exception: zero should be represented as "0x0").
export function hexEncodeQuantity(value: BN): string {
  return '0x' + (value.toString(16) || '0');
}

// When encoding UNFORMATTED DATA (byte arrays, account addresses, hashes, bytecode arrays): encode as hex, prefix with "0x", two hex digits per byte.
export function hexEncodeData(value: string | Buffer): string {
  return '0x' + toBuffer(value).toString('hex');
}
