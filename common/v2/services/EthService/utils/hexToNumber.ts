import BN from 'bn.js';
import { stripHexPrefix } from './formatters';

export function hexToNumber(hex: string) {
  return new BN(stripHexPrefix(hex)).toNumber();
}
