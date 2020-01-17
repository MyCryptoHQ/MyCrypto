import { isValidENSName } from '../validators';

describe('isValidENSName', () => {
  const valid = ['bob.eth', 'edouard.eth'];

  const invalid = [
    'et.eth', // second level domain must be longer than 2
    'edouard', // must contain domain
    '0xbob.eth' // and is not a hex number
  ];

  it('returns true if the name is valid', () => {
    valid.forEach(n => expect(isValidENSName(n)).toBe(true));
  });

  it('returns false if the name is invalid', () => {
    invalid.forEach(n => expect(isValidENSName(n)).toBe(false));
  });
});
