import BN from 'bn.js';
import { stripHexPrefix } from './stripHexPrefix';

export function hexToNumber(hex: string) {
  return new BN(stripHexPrefix(hex)).toNumber();
}
