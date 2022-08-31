import { stripHexPrefix, stripHexPrefixAndLower } from './stripHexPrefix';

describe('stripHexPrefix', () => {
  it('strips out the hex prefix from a hex string', () => {
    const actual = stripHexPrefix('0xABCDEF1234');
    expect(actual).toBe('ABCDEF1234');
  });

  it('does nothing when no hex prefix is present in a string', () => {
    const actual = stripHexPrefix('ABCDEF1234');
    expect(actual).toBe('ABCDEF1234');
  });
});

describe('stripHexPrefixAndLower', () => {
  it('strips out the hex prefix from a hex string and casts the result as lower case', () => {
    const actual = stripHexPrefixAndLower('0xABCDEF1234');
    expect(actual).toBe('abcdef1234');
  });

  it('does nothing when no hex prefix is present in a string and casts the result as lower case', () => {
    const actual = stripHexPrefixAndLower('ABCDEF1234');
    expect(actual).toBe('abcdef1234');
  });
});
