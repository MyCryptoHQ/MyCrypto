// Ref: https://github.com/ethereum/wiki/wiki/JSON-RPC
import { hexEncodeQuantity, hexEncodeData } from 'libs/nodes/rpc/utils';
import BN from 'bn.js';

// 0x41 (65 in decimal)
// 0x400 (1024 in decimal)
// WRONG: 0x (should always have at least one digit - zero is "0x0")
// WRONG: 0x0400 (no leading zeroes allowed)
// WRONG: ff (must be prefixed 0x)
describe('hexEncodeQuantity', () => {
  it('convert dec to hex', () => {
    expect(hexEncodeQuantity(new BN(65))).toEqual('0x41');
  });
  it('should strip leading zeroes', () => {
    expect(hexEncodeQuantity(new BN(1024))).toEqual('0x400');
  });
  it('should handle zeroes correctly', () => {
    expect(hexEncodeQuantity(new BN(0))).toEqual('0x0');
  });
});

// 0x41 (size 1, "A")
// 0x004200 (size 3, "\0B\0")
// 0x (size 0, "")
// WRONG: 0xf0f0f (must be even number of digits)
// WRONG: 004200 (must be prefixed 0x)
describe('hexEncodeData', () => {
  it('encode data to hex', () => {
    expect(hexEncodeData(Buffer.from('A'))).toEqual('0x41');
  });
  it('should not strip leading zeroes', () => {
    expect(hexEncodeData(Buffer.from('\0B\0'))).toEqual('0x004200');
  });
  it('should handle zero length data correctly', () => {
    expect(hexEncodeData(Buffer.from(''))).toEqual('0x');
  });
  it('Can take strings as an input', () => {
    expect(hexEncodeData('0xFEED')).toEqual('0xfeed');
    expect(hexEncodeData('FEED')).toEqual('0x46454544');
  });
});
