import { addHexPrefix } from './addHexPrefix';

describe('addHexPrefix', () => {
  it('adds hex prefix to regular string', () => {
    const actual = addHexPrefix('ABCDEF1234');
    expect(actual).toBe('0xABCDEF1234');
  });

  it('does nothing when a hex prefix is present in a string', () => {
    const actual = addHexPrefix('0xABCDEF1234');
    expect(actual).toBe('0xABCDEF1234');
  });
});
