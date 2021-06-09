// Ref: https://github.com/ethereum/wiki/wiki/JSON-RPC

import BigNumber from 'bignumber.js';
import { addHexPrefix } from 'ethereumjs-util';
import trimStart from 'lodash/trimStart';

// When encoding QUANTITIES (integers, numbers): encode as hex, prefix with "0x", the most compact representation (slight exception: zero should be represented as "0x0").
export function hexEncodeQuantity(value: BigNumber | Buffer) {
  const trimmedValue = trimStart(
    (value as any).toString(BigNumber.isBigNumber(value) ? 16 : 'hex'),
    '0'
  ); //@todo: fix typing
  return addHexPrefix(trimmedValue === '' ? '0' : trimmedValue);
}
