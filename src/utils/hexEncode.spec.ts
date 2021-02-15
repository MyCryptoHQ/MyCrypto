// Ref: https://github.com/ethereum/wiki/wiki/JSON-RPC

import { bigify } from './bigify';
import { hexEncodeQuantity } from './hexEncode';

// 0x41 (65 in decimal)
// 0x400 (1024 in decimal)
// WRONG: 0x (should always have at least one digit - zero is "0x0")
// WRONG: 0x0400 (no leading zeroes allowed)
// WRONG: ff (must be prefixed 0x)
describe('hexEncodeQuantity', () => {
  it('convert dec to hex', () => {
    expect(hexEncodeQuantity(bigify(65))).toEqual('0x41');
  });
  it('should strip leading zeroes', () => {
    expect(hexEncodeQuantity(bigify(1024))).toEqual('0x400');
  });
  it('should handle zeroes correctly', () => {
    expect(hexEncodeQuantity(bigify(0))).toEqual('0x0');
  });
});
