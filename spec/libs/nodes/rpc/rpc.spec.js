// Ref: https://github.com/ethereum/wiki/wiki/JSON-RPC
import { encodeQuantity, encodeData } from 'libs/nodes/rpc/utils';
import Big from 'big.js';

// 0x41 (65 in decimal)
// 0x400 (1024 in decimal)
// WRONG: 0x (should always have at least one digit - zero is "0x0")
// WRONG: 0x0400 (no leading zeroes allowed)
// WRONG: ff (must be prefixed 0x)
describe('encodeQuantity', () => {
  it('convert dec to hex', () => {
    expect(encodeQuantity(Big(65))).toEqual('0x41');
  });
  it('should strip leading zeroes', () => {
    expect(encodeQuantity(Big(1024))).toEqual('0x400');
  });
  it('should handle zeroes correctly', () => {
    expect(encodeQuantity(Big(0))).toEqual('0x0');
  });
});

// 0x41 (size 1, "A")
// 0x004200 (size 3, "\0B\0")
// 0x (size 0, "")
// WRONG: 0xf0f0f (must be even number of digits)
// WRONG: 004200 (must be prefixed 0x)
describe('encodeData', () => {
  it('encode data to hex', () => {
    expect(encodeData(Buffer.from('A'))).toEqual('0x41');
  });
  it('should not strip leading zeroes', () => {
    expect(encodeData(Buffer.from('\0B\0'))).toEqual('0x004200');
  });
  it('should handle zero length data correctly', () => {
    expect(encodeData(Buffer.from(''))).toEqual('0x');
  });
  it('Can take strings as an input', () => {
    expect(encodeData('0xFEED')).toEqual('0xfeed');
    expect(encodeData('FEED')).toEqual('0x46454544');
  });
});
